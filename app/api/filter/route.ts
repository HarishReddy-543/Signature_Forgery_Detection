import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File | null;
    const filterType = formData.get("filter_type") as string;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const base64 = `data:${image.type || "image/png"};base64,${buffer.toString("base64")}`;

    // Return the processed preview data URL
    return NextResponse.json({
      success: true,
      filter: filterType || "enhanced",
      image: base64,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
