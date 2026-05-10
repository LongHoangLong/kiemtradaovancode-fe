import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const authHeader = request.headers.get('Authorization');
    try {
        const body = await request.json();
        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Auth/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader || ''
            },
            body: JSON.stringify(body),
        });

        const data = await apiResponse.text();

        if (!apiResponse.ok) {
            return NextResponse.json({ error: data }, { status: apiResponse.status });
        }

        return NextResponse.json({ message: data }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Lỗi kết nối' }, { status: 500 });
    }
}