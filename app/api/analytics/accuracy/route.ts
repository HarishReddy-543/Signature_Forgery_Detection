import { NextResponse } from "next/server";

export async function GET() {
  const chartData = [
    { date: "09:00", accuracy: 97.4, verifications: 84 },
    { date: "10:00", accuracy: 98.1, verifications: 142 },
    { date: "11:00", accuracy: 98.5, verifications: 198 },
    { date: "12:00", accuracy: 97.9, verifications: 176 },
    { date: "13:00", accuracy: 98.3, verifications: 120 },
    { date: "14:00", accuracy: 98.8, verifications: 215 },
    { date: "15:00", accuracy: 98.4, verifications: 260 },
    { date: "16:00", accuracy: 99.1, verifications: 290 },
    { date: "17:00", accuracy: 98.6, verifications: 185 },
    { date: "18:00", accuracy: 98.2, verifications: 110 },
  ];

  return NextResponse.json({ data: chartData });
}
