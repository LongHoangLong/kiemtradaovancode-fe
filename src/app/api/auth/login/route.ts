import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // Nếu Backend trả về lỗi (401, 403, v.v.)
    if (!apiResponse.ok) {
      // Đọc nội dung lỗi dưới dạng text vì .NET StatusCode(403, "tin nhắn") trả về text
      const errorText = await apiResponse.text();
      return NextResponse.json({ error: errorText }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Lỗi kết nối máy chủ' }, { status: 500 });
  }
}