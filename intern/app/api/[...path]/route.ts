import { NextRequest } from "next/server";
import { handleApiRequest } from "../../../src/lib/mockBackend";

type Context = {
  params: { path?: string[] };
};

export async function GET(req: NextRequest, ctx: Context) {
  return handleApiRequest(req, ctx.params?.path ?? []);
}

export async function POST(req: NextRequest, ctx: Context) {
  return handleApiRequest(req, ctx.params?.path ?? []);
}

export async function PUT(req: NextRequest, ctx: Context) {
  return handleApiRequest(req, ctx.params?.path ?? []);
}

export async function PATCH(req: NextRequest, ctx: Context) {
  return handleApiRequest(req, ctx.params?.path ?? []);
}

export async function DELETE(req: NextRequest, ctx: Context) {
  return handleApiRequest(req, ctx.params?.path ?? []);
}
