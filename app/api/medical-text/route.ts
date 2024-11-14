import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const confidenceThreshold = parseFloat(
    url.searchParams.get("confidenceThreshold") || "0.6"
  );

  try {
    const texts = await prisma.medicalText.findMany({
      where: { confidence: { lte: confidenceThreshold } },
      orderBy: { confidence: "asc" },
    });

    return NextResponse.json(texts);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const dataArray = Array.isArray(body) ? body : [body];

    const createdTexts = [];

    for (const item of dataArray) {
      const {
        text,
        task,
        annotator,
        annotateReason,
        annotateTime,
        performance,
      } = item;
      if (
        typeof text !== "string" ||
        typeof task !== "string" ||
        typeof performance !== "number"
      ) {
        console.log("Validation failed for item:", item);
        return NextResponse.json(
          { error: "Invalid data types in one or more items" },
          { status: 400 }
        );
      }

      const newText = await prisma.medicalText.create({
        data: {
          text,
          task,
          confidence: 1.0,
          performance, 
          annotateReason,
          annotator,
          createdAt: new Date(),
          updatedAt: new Date(),
          annotateTime,
        },
      });

      createdTexts.push(newText);
    }
    return NextResponse.json(createdTexts, { status: 201 });
  } catch (error) {
    console.error("Detailed error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
