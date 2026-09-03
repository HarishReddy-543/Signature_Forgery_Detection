import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8090";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const signature = formData.get("signature") as File | null;
    const reference = formData.get("reference") as File | null;

    if (!signature) {
      return NextResponse.json(
        { error: "No signature file provided" },
        { status: 400 }
      );
    }

    // Forward request to backend
    const backendFormData = new FormData();
    backendFormData.append("signature", signature);
    if (reference) {
      backendFormData.append("reference", reference);
    }

    const response = await fetch(`${BACKEND_URL}/api/verify`, {
      method: "POST",
      body: backendFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Analysis failed on backend" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error calling backend:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend server" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    if (!response.ok) {
      return NextResponse.json(
        { status: "unhealthy", backend_available: false },
        { status: 503 }
      );
    }
    const health = await response.json();
    return NextResponse.json({
      status: "healthy",
      backend_available: true,
      ...health,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        backend_available: false,
        error: "Cannot connect to backend server",
      },
      { status: 503 }
    );
  }
}
