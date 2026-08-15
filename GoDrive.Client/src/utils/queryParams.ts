// fetchBaseQuery stringifies every param via URLSearchParams, which turns an
// undefined filter into the literal string "undefined" - that fails ASP.NET Core's
// query-string model binding for optional (nullable) filters. Strip empty ones first.
export function buildQueryParams(params: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }
    result[key] = String(value);
  }

  return result;
}
