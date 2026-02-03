import { API_ENDPOINT } from "@/config/api-config";
import { getJson, postJson } from "./http";

export const postFeedbackPlaylist = ({ data, token = null }) => {
  return postJson(
    API_ENDPOINT.postPlaylistFeedback,
    data,
    token && `Bearer ${token}`,
  );
};

export const postFeedbackHost = ({ data, token = null }) => {
  return postJson(
    API_ENDPOINT.postHostFeedback,
    data,
    token && `Bearer ${token}`,
  );
};

export const getLiveFeedback = ({ since, token }) => {
  const payload =
    typeof since === "number" && Number.isFinite(since) ? { since } : null;
  const authorization = token ? `Bearer ${token}` : null;
  return getJson(API_ENDPOINT.getLiveFeedback, payload, authorization);
};
