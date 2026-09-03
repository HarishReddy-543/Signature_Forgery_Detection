import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    is_training: false,
    progress: 100,
    history: [
      { epoch: 1, loss: 0.452 },
      { epoch: 2, loss: 0.312 },
      { epoch: 3, loss: 0.198 },
      { epoch: 4, loss: 0.124 },
      { epoch: 5, loss: 0.078 },
    ],
    status: "idle",
  });
}
