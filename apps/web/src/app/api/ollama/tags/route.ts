import { NextRequest, NextResponse } from "next/server";

function normalizeBaseURL(url: string): string {
  return url.replace(/\/$/, "");
}

export async function GET(request: NextRequest) {
  const baseURL =
    request.nextUrl.searchParams.get("baseURL") ||
    "http://localhost:11434";

  try {
    const normalized = normalizeBaseURL(baseURL);
    const upstreamResponse = await fetch(`${normalized}/api/tags`, {
      signal: AbortSignal.timeout(8000),
    });

    if (!upstreamResponse.ok) {
      const text = await upstreamResponse.text().catch(() => "");
      return NextResponse.json(
        { error: `Ollama error: ${upstreamResponse.status} ${text}` },
        { status: upstreamResponse.status }
      );
    }

    const data = await upstreamResponse.json();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}