/**
 * TTS Endpoint — POST /api/tts
 * Generates speech audio from text using Venice TTS API
 */

import { NextRequest, NextResponse } from 'next/server';
import { veniceTTS, withRetry } from '@/lib/venice';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, voiceId } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const audioBuffer = await withRetry(async () =>
      veniceTTS({
        model: 'tts-kokoro',
        input: text,
        voice: voiceId || 'eleven_multilingual_v2',
        speed: 1.0,
      })
    );

    // Return audio as blob
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="speech.mp3"',
      },
    });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'TTS generation failed' },
      { status: 500 }
    );
  }
}
