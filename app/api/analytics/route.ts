import { NextResponse } from "next/server";

export async function GET() {
  const analytics = {
    model_accuracy: 98.2,
    precision: 97.9,
    false_positive_rate: 0.4,
    avg_response_time: 1.2,
    total_verifications: 12847,
    genuine_count: 11234,
    forged_count: 1428,
    genuine_percent: 88.7,
    forged_percent: 11.3,
    weekly_data: [
      { day: "Mon", genuine: 1420, forged: 165 },
      { day: "Tue", genuine: 1680, forged: 198 },
      { day: "Wed", genuine: 1890, forged: 231 },
      { day: "Thu", genuine: 1750, forged: 210 },
      { day: "Fri", genuine: 1920, forged: 245 },
      { day: "Sat", genuine: 1340, forged: 182 },
      { day: "Sun", genuine: 1234, forged: 197 },
    ],
    hourly_data: [
      { hour: "00:00", count: 42 },
      { hour: "02:00", count: 18 },
      { hour: "04:00", count: 12 },
      { hour: "06:00", count: 35 },
      { hour: "08:00", count: 145 },
      { hour: "10:00", count: 280 },
      { hour: "12:00", count: 320 },
      { hour: "14:00", count: 290 },
      { hour: "16:00", count: 340 },
      { hour: "18:00", count: 210 },
      { hour: "20:00", count: 125 },
      { hour: "22:00", count: 68 },
    ],
  };

  return NextResponse.json(analytics);
}
