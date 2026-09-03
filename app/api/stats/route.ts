import { NextResponse } from "next/server";

export async function GET() {
  const stats = {
    overview: {
      totalVerifications: 12847,
      genuineSignatures: 11234,
      forgedDetected: 1428,
      inconclusive: 185,
      avgProcessingTime: 1.8,
    },
    trends: {
      verificationsChange: 12.5,
      genuineChange: 8.2,
      forgedChange: -3.1,
      processingTimeChange: -0.3,
    },
    model: {
      accuracy: 98.2,
      precision: 97.9,
      recall: 98.4,
      f1Score: 98.1,
      falsePositiveRate: 0.4,
      falseNegativeRate: 0.8,
    },
    activity: {
      today: {
        total: 972,
        genuine: 847,
        forged: 112,
        inconclusive: 13,
      },
      thisWeek: {
        total: 5847,
        genuine: 5102,
        forged: 678,
        inconclusive: 67,
      },
      thisMonth: {
        total: 12847,
        genuine: 11234,
        forged: 1428,
        inconclusive: 185,
      },
    },
    topVerifiers: [
      { name: "John Smith", verifications: 1247, accuracy: 99.1 },
      { name: "Sarah Johnson", verifications: 1089, accuracy: 98.7 },
      { name: "Michael Chen", verifications: 956, accuracy: 98.9 },
      { name: "Emily Davis", verifications: 892, accuracy: 98.2 },
      { name: "Robert Wilson", verifications: 834, accuracy: 98.5 },
    ],
    departmentStats: [
      { name: "Legal", verifications: 3421, fraudPrevented: 412 },
      { name: "Finance", verifications: 2987, fraudPrevented: 356 },
      { name: "HR", verifications: 2145, fraudPrevented: 189 },
      { name: "Procurement", verifications: 1876, fraudPrevented: 234 },
      { name: "Healthcare", verifications: 1534, fraudPrevented: 167 },
    ],
  };

  return NextResponse.json(stats);
}
