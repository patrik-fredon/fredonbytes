import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Log file information (in production, you'd process/store these files)
    const fileInfo = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }));

    console.log("Received files:", fileInfo);

    const referer = request.headers.get("referer") || request.url;
    const locale = new URL(referer).pathname.match(/^\/([^/]+)/)?.[1] || "en";
    const projectsUrl = new URL(`/${locale}/projects`, request.url);
    projectsUrl.searchParams.set("uploaded", files.length.toString());

    return NextResponse.redirect(projectsUrl);
  } catch (error) {
    console.error("File handler error:", error);
    return NextResponse.json(
      { error: "Failed to process files" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const referer = request.headers.get("referer") || request.url;
  const locale = new URL(referer).pathname.match(/^\/([^/]+)/)?.[1] || "en";
  return NextResponse.redirect(new URL(`/${locale}/projects`, request.url));
}
