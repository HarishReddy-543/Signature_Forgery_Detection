import { NextResponse } from "next/server";
import manifest from "@/lib/dataset-manifest.json";

const CDN_BASE = "https://cdn.jsdelivr.net/gh/HarishReddy-543/Signature_Forgery_Detection@main/backend/dataset";
const RAW_BASE = "https://raw.githubusercontent.com/HarishReddy-543/Signature_Forgery_Detection/main/backend/dataset";

interface ManifestData {
  total: number;
  genuineCount: number;
  forgedCount: number;
  genuine: string[];
  forged: string[];
}

const data = manifest as ManifestData;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all"; // 'genuine' | 'forged' | 'all'
  const personFilter = searchParams.get("person"); // e.g. '1', '2'
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const perPage = Math.min(100, Math.max(12, parseInt(searchParams.get("per_page") || "24")));

  const genuineList = data.genuine.map((filename) => {
    // filename format: original_X_Y.png
    const match = filename.match(/original_(\d+)_(\d+)\.png/);
    const person = match ? parseInt(match[1]) : 0;
    const sample = match ? parseInt(match[2]) : 0;
    return {
      filename,
      type: "genuine" as const,
      person,
      sample,
      label: `Person ${person} — Sample ${sample} (Genuine)`,
      url: `${CDN_BASE}/genuine/${filename}`,
      fallbackUrl: `${RAW_BASE}/genuine/${filename}`,
    };
  });

  const forgedList = data.forged.map((filename) => {
    // filename format: forgeries_X_Y.png
    const match = filename.match(/forgeries_(\d+)_(\d+)\.png/);
    const person = match ? parseInt(match[1]) : 0;
    const sample = match ? parseInt(match[2]) : 0;
    return {
      filename,
      type: "forged" as const,
      person,
      sample,
      label: `Person ${person} — Forgery ${sample} (Forged)`,
      url: `${CDN_BASE}/forged/${filename}`,
      fallbackUrl: `${RAW_BASE}/forged/${filename}`,
    };
  });

  let items =
    type === "genuine"
      ? genuineList
      : type === "forged"
      ? forgedList
      : [...genuineList, ...forgedList];

  // Optional person filter
  if (personFilter) {
    const pNum = parseInt(personFilter);
    if (!isNaN(pNum)) {
      items = items.filter((it) => it.person === pNum);
    }
  }

  // Optional search filter
  if (search) {
    items = items.filter(
      (it) =>
        it.filename.toLowerCase().includes(search) ||
        it.label.toLowerCase().includes(search) ||
        `person ${it.person}`.includes(search)
    );
  }

  const total = items.length;
  const totalPages = Math.ceil(total / perPage) || 1;
  const startIndex = (page - 1) * perPage;
  const paginatedItems = items.slice(startIndex, startIndex + perPage);

  return NextResponse.json({
    items: paginatedItems,
    total,
    totalPages,
    page,
    perPage,
    datasetStats: {
      total: data.total,
      genuineCount: data.genuineCount,
      forgedCount: data.forgedCount,
      totalSigners: 55,
      samplesPerSigner: 24,
    },
  });
}
