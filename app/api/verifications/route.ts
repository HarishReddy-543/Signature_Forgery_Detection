import { NextResponse } from "next/server";

const mockVerifications = [
  {
    id: "VER-2024-001234",
    documentName: "Contract_Agreement_Final.pdf",
    result: "genuine",
    confidence: 99.2,
    timestamp: "2024-01-24T14:32:15Z",
    verifier: "John Smith",
    department: "Legal",
  },
  {
    id: "VER-2024-001233",
    documentName: "Bank_Authorization_Form.pdf",
    result: "forged",
    confidence: 96.8,
    timestamp: "2024-01-24T14:18:42Z",
    verifier: "Sarah Johnson",
    department: "Finance",
  },
  {
    id: "VER-2024-001232",
    documentName: "Employment_Contract.pdf",
    result: "genuine",
    confidence: 98.5,
    timestamp: "2024-01-24T13:55:21Z",
    verifier: "Michael Chen",
    department: "HR",
  },
  {
    id: "VER-2024-001231",
    documentName: "Insurance_Claim_2024.pdf",
    result: "inconclusive",
    confidence: 67.3,
    timestamp: "2024-01-24T13:42:08Z",
    verifier: "Emily Davis",
    department: "Claims",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = parseInt(searchParams.get("offset") || "0");
  const result = searchParams.get("result");

  let filteredData = mockVerifications;

  if (result && result !== "all") {
    filteredData = mockVerifications.filter((v) => v.result === result);
  }

  const paginatedData = filteredData.slice(offset, offset + limit);

  return NextResponse.json({
    data: paginatedData,
    total: filteredData.length,
    limit,
    offset,
    hasMore: offset + limit < filteredData.length,
  });
}
