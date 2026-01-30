export const BACKEND_BASE_URL =
  import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8080";

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
    detail = JSON.stringify(data || "An Error occured!");
  }

  const error = new Error(detail);
  error.detail = detail;
  return error;
};

const postJson = async (path, payload, authorization = null) => {
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

const getJson = async (path, payload = null, authorization = null) => {
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

export const register = async ({ email, password }) => {
  return postJson("/register", { email, password });
};

export const login = async ({ email, password }) => {
  return postJson("/login", { email, password });
};

export const get = async (path, payload, authorization) => {
  return getJson(path, payload, authorization);
};

export const getCurrentTrack = () => getJson("/current-track");

export const postSongWish = ({ data, token = null }) => {
  return postJson("/wish", data, token && `Bearer ${token}`);
};

export const postPlaylistRating = ({ data, token = null }) => {
  return postJson("/rateplaylist", data, token && `Bearer ${token}`);
};

export const getCurrentHost = () => getJson("/current-host");

export const getLive = ({ since, token }) => {
  const payload =
    typeof since === "number" && Number.isFinite(since) ? { since } : null;
  const authorization = token ? `Bearer ${token}` : null;
  return getJson("/host/live", payload, authorization);
};
