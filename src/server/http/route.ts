import { NextResponse } from "next/server";
import { HttpError } from "@/server/http/errors";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function jsonError(err: unknown) {
  if (err instanceof HttpError) {
    return NextResponse.json(
      { ok: false, error: { code: err.code, message: err.message, details: err.details } },
      { status: err.status },
    );
  }
  if (err instanceof Error && err.message === "UNAUTHENTICATED") {
    return NextResponse.json({ ok: false, error: { code: "UNAUTHENTICATED", message: "You must be signed in." } }, { status: 401 });
  }
  return NextResponse.json(
    { ok: false, error: { code: "INTERNAL", message: "Unexpected error." } },
    { status: 500 },
  );
}

