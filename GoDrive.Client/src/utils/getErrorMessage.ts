import type { TApiErrorEnvelope } from "../types/common";

function hasErrorEnvelope(data: unknown): data is TApiErrorEnvelope {
  return typeof data === "object" && data !== null && "message" in data;
}

// RTK Query error args are typed `unknown` (FetchBaseQueryError | SerializedError) -
// this narrows to the backend's actual error envelope shape before reading it.
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data?: unknown }).data;
    if (hasErrorEnvelope(data)) {
      if (data.errors.length > 0) {
        return data.errors.join(" ");
      }
      return data.message;
    }
  }

  return "Something went wrong. Please try again.";
}
