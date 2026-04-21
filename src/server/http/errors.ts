export class HttpError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function unauthenticated() {
  return new HttpError(401, "UNAUTHENTICATED", "You must be signed in.");
}

export function forbidden(message = "You do not have access.") {
  return new HttpError(403, "FORBIDDEN", message);
}

export function badRequest(message: string, details?: unknown) {
  return new HttpError(400, "BAD_REQUEST", message, details);
}

export function notFound(message = "Not found.") {
  return new HttpError(404, "NOT_FOUND", message);
}

