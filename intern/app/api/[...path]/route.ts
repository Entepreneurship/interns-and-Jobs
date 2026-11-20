import { NextRequest, NextResponse } from "next/server";
import { handleApiRequest } from "../../../src/lib/mockBackend";

type Context = {
  params: { path?: string[] };
};

const UPSTREAM_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

function shouldProxy(req: NextRequest): boolean {
  if (
    !UPSTREAM_BASE.startsWith("http://") &&
    !UPSTREAM_BASE.startsWith("https://")
  ) {
    return false;
  }
  try {
    const upstreamUrl = new URL(UPSTREAM_BASE);
    const reqHost = req.headers.get("host") || "";
    if (reqHost && upstreamUrl.host === reqHost) {
      return false;
    }
  } catch {
    return false;
  }
  return true;
}

async function proxyToUpstream(
  req: NextRequest,
  pathParts: string[]
): Promise<NextResponse | null> {
  if (!shouldProxy(req)) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const joined = pathParts.map((s) => encodeURIComponent(s)).join("/");
    const search = req.nextUrl?.search ?? new URL(req.url).search;
    const targetUrl = `${UPSTREAM_BASE}/${joined}${search}`;

    const headers = new Headers();
    for (const name of ["authorization", "content-type", "accept"]) {
      const val = req.headers.get(name);
      if (val) headers.set(name, val);
    }

    const method = req.method.toUpperCase();
    const body =
      method !== "GET" && method !== "HEAD"
        ? await req.clone().arrayBuffer()
        : undefined;

    const upstreamRes = await fetch(targetUrl, {
      method,
      headers,
      body: body && body.byteLength > 0 ? body : undefined,
      signal: controller.signal,
      cache: "no-store",
    });

    if (upstreamRes.status >= 502) {
      return null;
    }

    const resHeaders = new Headers();
    for (const name of ["content-type", "content-disposition"]) {
      const val = upstreamRes.headers.get(name);
      if (val) resHeaders.set(name, val);
    }

    const resBody = await upstreamRes.arrayBuffer();
    return new NextResponse(resBody, {
      status: upstreamRes.status,
      headers: resHeaders,
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function dispatch(req: NextRequest, ctx: Context) {
  const pathParts = ctx.params?.path ?? [];
  const proxied = await proxyToUpstream(req, pathParts);
  if (proxied) return proxied;
  return handleApiRequest(req, pathParts);
}

export async function GET(req: NextRequest, ctx: Context) {
  return dispatch(req, ctx);
}

export async function POST(req: NextRequest, ctx: Context) {
  return dispatch(req, ctx);
}

export async function PUT(req: NextRequest, ctx: Context) {
  return dispatch(req, ctx);
}

export async function PATCH(req: NextRequest, ctx: Context) {
  return dispatch(req, ctx);
}

export async function DELETE(req: NextRequest, ctx: Context) {
  return dispatch(req, ctx);
}
