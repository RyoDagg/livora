class ApiService {
  baseUrl = process.env.NEXT_PUBLIC_API_URL;

  async request(path: string, options?: RequestInit) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: options?.headers || {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || res.statusText);
    }

    return res.json();
  }

  get(path: string, options?: RequestInit) {
    return this.request(path, options);
  }

  post(path: string, body?: any, options?: RequestInit) {
    options = {
      ...options,
      body: JSON.stringify(body),
      method: 'POST',
    };
    return this.request(path, options);
  }

  put(path: string, body?: any, options?: RequestInit) {
    options = {
      ...options,
      body: JSON.stringify(body),
      method: 'PUT',
    };
    return this.request(path, options);
  }

  deleta(path: string, options?: RequestInit) {
    options = {
      ...options,
      method: 'DELETE',
    };
    return this.request(path, options);
  }

  upload(path: string, body: FormData, options?: RequestInit) {
    options = {
      ...options,
      headers: {},
      body: body,
      method: 'POST',
    };
    return this.request(path, options);
  }
}

export const api = new ApiService();
