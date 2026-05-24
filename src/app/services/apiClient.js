const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://livresliber.vercel.app/api';

function getAuthToken() {
  try {
    return localStorage.getItem('btc_token') || localStorage.getItem('token') || null;
  } catch {
    return null;
  }
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const url = `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

  const token = getAuthToken();
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);
    const validationErrors = payload?.errors
      ? Object.values(payload.errors).flat().join(' ')
      : '';
    const textPayload = typeof payload === 'string' ? payload : '';
    const message =
      validationErrors ||
      payload?.message ||
      payload?.error ||
      payload?.detail ||
      textPayload ||
      `${res.status} ${res.statusText}` ||
      'Request failed';
    const error = new Error(message);
    error.status = res.status;
    error.payload = payload;
    throw error;
  }

  return isJson ? res.json() : res.text();
}

export const apiClient = {
  get: (path, opts) => request(path, { method: 'GET', ...opts }),
  post: (path, body, opts) => request(path, { method: 'POST', body, ...opts }),
  patch: (path, body, opts) => request(path, { method: 'PATCH', body, ...opts }),
  delete: (path, opts) => request(path, { method: 'DELETE', ...opts }),
};

