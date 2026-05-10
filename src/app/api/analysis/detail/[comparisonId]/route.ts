import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { comparisonId: string } }
) {
  try {
    const { comparisonId } = params;
    const authToken = request.headers.get('Authorization');

    if (!authToken) {
        return new NextResponse('Authorization header missing', { status: 401 });
    }
    
    if (!comparisonId) {
      return new NextResponse('Comparison ID is required', { status: 400 });
    }

    // Ensure the backend URL is correct
    const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Analysis/detail/${comparisonId}`, {
      method: 'GET',
      headers: {
        'Authorization': authToken,
        'Content-Type': 'application/json',
      },
    });

    const responseText = await apiResponse.text();

    if (!apiResponse.ok) {
        return new NextResponse(responseText, { status: apiResponse.status });
    }

    try {
        const data = JSON.parse(responseText);
        return NextResponse.json(data);
    } catch (error) {
        console.error(`[API PROXY - DETAIL] JSON PARSE ERROR: ${error}`);
        return new NextResponse('Invalid JSON response from backend', { status: 502 });
    }

  } catch (error: any) {
    console.error(`[API PROXY - DETAIL] ${error.message}`);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}
