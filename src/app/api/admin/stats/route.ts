import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const authHeader = request.headers.get('Authorization');
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Admin/stats`, {
            headers: { 'Authorization': authHeader || '' },
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}