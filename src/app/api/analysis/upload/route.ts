import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const authToken = request.headers.get('Authorization');

    if (!authToken) {
        return new NextResponse('Authorization header missing', { status: 401 });
    }

    const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Analysis/upload`, {
      method: 'POST',
      headers: {
        'Authorization': authToken,
      },
      body: formData,
    });

    const responseText = await apiResponse.text();

    if (!apiResponse.ok) {
      return new NextResponse(responseText, { status: apiResponse.status });
    }

    try {
        const data = JSON.parse(responseText);
        return NextResponse.json(data);
    } catch (error) {
        // Handle cases where the response is OK but not valid JSON
        console.error(`[API PROXY - UPLOAD] JSON PARSE ERROR: ${error}`);
        return new NextResponse('Invalid JSON response from backend', { status: 502 }); // Bad Gateway
    }

  } catch (error: any) {
    console.error(`[API PROXY - UPLOAD] ${error.message}`);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}
