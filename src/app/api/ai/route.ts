import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { messages } = body;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: messages,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: `Groq API Error: ${errorText}` },
                { status: response.status }
            );
        }

        const result = await response.json();
        const text = result.choices?.[0]?.message?.content || '';
        return NextResponse.json({ text });

    } catch (error: any) {
        console.error('AI Proxy Error:', error);
        return NextResponse.json(
            { error: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}
