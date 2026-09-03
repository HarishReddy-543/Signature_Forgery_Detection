import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all"; // genuine | forged | all
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("per_page") || "20");

  const genuineDir = path.join(process.cwd(), "public", "dataset", "genuine");
  const forgedDir = path.join(process.cwd(), "public", "dataset", "forged");

  let genuineFiles: string[] = [];
  let forgedFiles: string[] = [];

  try {
    if (fs.existsSync(genuineDir)) {
      genuineFiles = fs
        .readdirSync(genuineDir)
        .filter((f) => f.endsWith(".png") || f.endsWith(".jpg"))
        .map((f) => `/dataset/genuine/${f}`);
    }
  } catch (_) {}

  try {
    if (fs.existsSync(forgedDir)) {
      forgedFiles = fs
        .readdirSync(forgedDir)
        .filter((f) => f.endsWith(".png") || f.endsWith(".jpg"))
        .map((f) => `/dataset/forged/${f}`);
    }
  } catch (_) {}

  const genuineItems = genuineFiles.map((url) => ({
    url,
    type: "genuine",
    filename: path.basename(url),
    label: `Genuine — ${path.basename(url).replace("original_", "Person ").replace(".png", "")}`,
  }));

  const forgedItems = forgedFiles.map((url) => ({
    url,
    type: "forged",
    filename: path.basename(url),
    label: `Forged — ${path.basename(url).replace("forgeries_", "Person ").replace(".png", "")}`,
  }));

  let all =
    type === "genuine"
      ? genuineItems
      : type === "forged"
      ? forgedItems
      : [...genuineItems, ...forgedItems];

  const total = all.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const items = all.slice(start, start + perPage);

  return NextResponse.json({
    items,
    total,
    page,
    totalPages,
    perPage,
    genuineCount: genuineItems.length,
    forgedCount: forgedItems.length,
  });
}
