export const api = async (url: string, options: RequestInit = {}) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // optional: if you use cookies
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
};
