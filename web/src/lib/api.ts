export class ApiError extends Error {
  status: number;
  code: string;
  details?: string[];

  constructor(params: {
    message: string;
    status: number;
    code?: string;
    details?: string[];
  }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status;
    this.code = params.code || 'API_ERROR';
    this.details = params.details;
  }
}

class ApiService {
  baseUrl = process.env.NEXT_PUBLIC_API_URL;

  private async parseResponseBody(res: Response) {
    const text = await res.text();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  async request(path: string, options?: RequestInit) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: options?.headers || {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const body = await this.parseResponseBody(res);

    if (!res.ok) {
      const payload = body && typeof body === 'object' ? body : {};
      const message =
        (payload as { message?: string }).message ||
        (payload as { error?: string }).error ||
        res.statusText ||
        'Request failed';
      const code = (payload as { code?: string }).code || 'API_ERROR';
      const details = (payload as { details?: string[] }).details;

      throw new ApiError({ message, status: res.status, code, details });
    }

    return body;
  }

  get(path: string, options?: RequestInit) {
    return this.request(path, options);
  }

  post(path: string, body?: Record<string, unknown>, options?: RequestInit) {
    options = {
      ...options,
      body: JSON.stringify(body),
      method: 'POST',
    };
    return this.request(path, options);
  }

  put(path: string, body?: Record<string, unknown>, options?: RequestInit) {
    options = {
      ...options,
      body: JSON.stringify(body),
      method: 'PUT',
    };
    return this.request(path, options);
  }

  delete(path: string, options?: RequestInit) {
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
