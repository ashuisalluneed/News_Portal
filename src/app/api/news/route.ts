import { NextResponse } from 'next/server';
import { fetchArticles } from '@/services/newsApi';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || 'us';
    const category = searchParams.get('category') || undefined;
    const limit = parseInt(searchParams.get('limit') || '6');

    try {
        const articles = await fetchArticles(limit, category, country);
        return NextResponse.json({ articles });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
