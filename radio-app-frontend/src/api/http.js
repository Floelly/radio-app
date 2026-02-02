import { BACKEND_BASE_URL, UI_TEXT } from "@config";

const buildError = (data) => {
  let detail = "";
  if (typeof data?.detail === "string") {
    detail = data.detail;
  } else if (Array.isArray(data?.detail)) {
    detail = data.detail
      .map((item) =>
        typeof item?.msg === "string" ? item.msg : JSON.stringify(item),
      )
      .join("\n\n");
  } else {
    detail = JSON.stringify(data || UI_TEXT.common.genericError);
  }

  const error = new Error(detail);
  error.detail = detail;
  return error;
};

export const postJson = async (path, payload, authorization = null) => {
  const headers = { "Content-Type": "application/json" };
  if (authorization) {
    headers.Authorization = authorization;
  }
  const response = await fetch(`${BACKEND_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw buildError(data);
  }
  return data;
};

export const getJson = async (path, payload = null, authorization = null) => {
  const query = payload ? `?${new URLSearchParams(payload).toString()}` : "";
  const headers = {};
  if (authorization) {
    headers.Authorization = authorization;
  }

  const response = await fetch(`${BACKEND_BASE_URL}${path}${query}`, {
    method: "GET",
    headers,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok && response.status != 304) {
    throw buildError(data);
  }
  return data;
};

export const get = async (path, payload, authorization) => {
  return getJson(path, payload, authorization);
};
