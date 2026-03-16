import { NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { query, location } = await req.json();
    
    if (!process.env.FIRECRAWL_API_KEY) {
      return NextResponse.json({ error: 'Firecrawl API Key is missing. Please add FIRECRAWL_API_KEY to your .env.local file.' }, { status: 400 });
    }

    const firecrawl = new FirecrawlApp({
      apiKey: process.env.FIRECRAWL_API_KEY
    });

    const searchQuery = `${query} jobs ${location ? `in ${location}` : ''}`;
    
    // We use Firecrawl's extract via search. For simple job searching, we can search the web and parse the markdown
    const searchResponse = await firecrawl.search(searchQuery, {
      limit: 3, 
      scrapeOptions: {
        formats: ['markdown'],
      }
    }) as any;

    if (searchResponse.error || searchResponse.success === false) {
      return NextResponse.json({ error: searchResponse.error || 'Firecrawl search failed' }, { status: 500 });
    }

    const resultsArray = searchResponse.web || searchResponse.data || [];
    
    // Combine markdown from search results
    const combinedMarkdown = resultsArray.map((result: any) => result.markdown).filter(Boolean).join('\n\n---\n\n').substring(0, 15000);

    // Use Groq to parse jobs out of the markdown
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert ATS and recruitment AI. Extract job listings from the provided markdown content scraped from a search engine. Respond strictly with a JSON array of job objects with fields: { "title": string, "company": string, "location": string, "description": string, "salary": string | null, "applyUrl": string }. Provide at least a few words for the description. If no jobs found, return { "jobs": [] }.'
        },
        {
          role: 'user',
          content: `Extract jobs from the following markdown text:\n\n${combinedMarkdown}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    const resultText = completion.choices[0]?.message?.content || '{"jobs": []}';
    let jobs = [];
    try {
      const parsed = JSON.parse(resultText);
      jobs = parsed.jobs || Object.values(parsed)[0] || [];
      if (!Array.isArray(jobs) && Array.isArray(parsed)) jobs = parsed;
    } catch (e) {
      console.error("Failed to parse groq output", e);
    }

    return NextResponse.json({ jobs });
  } catch (error: any) {
    console.error("Job Search Route Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
