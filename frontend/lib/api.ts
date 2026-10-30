const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function api(path: string, body?: unknown, method = body ? "POST" : "GET") {
  const r = await fetch(API + path, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!r.ok)
    throw new Error(
      r.status === 401
        ? "Log in to do this"
        : ((await r.json().catch(() => ({}))).error ?? r.statusText),
    );
  return r.json();
}

export const inp = "w-full rounded-md border bg-background px-3 py-2 text-sm";
