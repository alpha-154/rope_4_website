import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

export const publicApiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

publicApiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const orgId =
      localStorage.getItem("organizationId") ||
      process.env.NEXT_PUBLIC_ORGANIZATION_ID;
    if (orgId) {
      config.headers["x-organization-id"] = orgId;
    }

    const customerToken = localStorage.getItem("customerToken");
    if (customerToken) {
      config.headers.Authorization = `Bearer ${customerToken}`;
    }
  }
  return config;
});

