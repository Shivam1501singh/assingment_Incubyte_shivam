// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL="https://assingment-incubyte-shivam.onrender.com"

export const http = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("sweetshop_token");

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw error;
  }

  return res.json();
};
