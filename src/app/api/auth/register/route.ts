import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await apiResponse.text();

    if (!apiResponse.ok) {
      return new NextResponse(data, { status: apiResponse.status });
    }

    return new NextResponse(data, { status: 200 });

  } catch (error: any) {
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}
