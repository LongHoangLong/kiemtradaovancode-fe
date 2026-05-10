import { NextResponse } from 'next/server';

// 1. API Lấy danh sách users
export async function GET(request: Request) {
    const authHeader = request.headers.get('Authorization');
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Admin/users`, {
            headers: { 'Authorization': authHeader || '' },
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 2. API Xóa user (MỚI THÊM)
export async function DELETE(request: Request) {
    // Lấy id từ URL dạng ?id=... thay vì /[id]
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const authHeader = request.headers.get('Authorization');

    try {
        // Truyền id sang Backend .NET
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Admin/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': authHeader || '' },
        });

        if (!res.ok) throw new Error('Không thể xóa người dùng');
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}