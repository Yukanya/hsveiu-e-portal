import { NextResponse } from 'next/server';
import { getFacebookHsvNews } from '@/lib/services/facebook-news';

export async function GET() {
  try {
    const news = await getFacebookHsvNews();
    return NextResponse.json({
      success: true,
      source: 'https://www.facebook.com/eiuhsv/',
      tag: '[HSV NEWS]',
      total: news.length,
      data: news,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

