import { NextResponse } from "next/server";

export async function GET() {
  const history = [
    {
      id: "SIG-98421",
      result: "Genuine",
      confidence: 99.1,
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: "SIG-98420",
      result: "Forged",
      confidence: 97.4,
      timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    },
    {
      id: "SIG-98419",
      result: "Genuine",
      confidence: 98.8,
      timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    },
    {
      id: "SIG-98418",
      result: "Genuine",
      confidence: 96.5,
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    {
      id: "SIG-98417",
      result: "Forged",
      confidence: 94.2,
      timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    },
    {
      id: "SIG-98416",
      result: "Genuine",
      confidence: 99.4,
      timestamp: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    },
  ];

  return NextResponse.json(history);
}
