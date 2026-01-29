import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message, properties } = await request.json();

    const systemPrompt = `You are an AI assistant for property owners/managers. 

Properties they manage:
${properties.map((p: any) => `- ${p.name}: ${p.address}, ${p.city}, ${p.state}`).join('\n')}

When they ask about maintenance issues, analyze:
1. URGENCY (Low/Medium/High/Emergency)
2. ESTIMATED COST
3. LEGAL RISK (habitability laws, timelines)
4. ACTION PLAN (step-by-step what to do)

Be concise and actionable. Use emojis for urgency levels:
🟢 Low
🟡 Medium  
🔴 High
🚨 Emergency`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        { role: 'user', content: message }
      ],
    });

    const aiMessage = response.content[0].type === 'text' ? response.content[0].text : '';

    return NextResponse.json({ message: aiMessage });

  } catch (error: any) {
    console.error('AI Chat error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get AI response' },
      { status: 500 }
    );
  }
}