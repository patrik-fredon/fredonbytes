import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const data = searchParams.get("data");

    if (!data) {
      return NextResponse.json(
        { error: "No protocol data provided" },
        { status: 400 },
      );
    }

    console.log("Received protocol data:", data);

    const referer = request.headers.get("referer") || request.url;
    const locale = new URL(referer).pathname.match(/^\/([^/]+)/)?.[1] || "en";

    if (data.startsWith("mailto:")) {
      const email = data.replace("mailto:", "");
      const contactUrl = new URL(`/${locale}/contact`, request.url);
      contactUrl.searchParams.set("to", email);
      return NextResponse.redirect(contactUrl);
    }

    if (data.startsWith("web+fredonbytes:")) {
      const action = data.replace("web+fredonbytes:", "");
      console.log("Custom protocol action:", action);
      const homeUrl = new URL(`/${locale}`, request.url);
      homeUrl.searchParams.set("action", action);
      return NextResponse.redirect(homeUrl);
    }

    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  } catch (error) {
    console.error("Protocol handler error:", error);
    return NextResponse.json(
      { error: "Failed to process protocol" },
      { status: 500 },
    );
  }
}
