import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token || token !== process.env.REVALIDATE_TOKEN) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Invalid or missing revalidation token",
        },
        { status: 401 },
      );
    }

    revalidatePath("/[locale]/projects", "page");

    return NextResponse.json(
      {
        revalidated: true,
        path: "/[locale]/projects",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error revalidating projects page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
