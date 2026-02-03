import { API_ENDPOINT } from "@/config/api-config";
import { getJson, postJson } from "./http";
import { attachToken } from "./auth";

export const postFeedbackPlaylist = ({ data, token = null }) => {
  return postJson(
    API_ENDPOINT.postPlaylistFeedback,
    data,
    token && attachToken(token),
  );
};

export const postFeedbackHost = ({ data, token = null }) => {
  return postJson(
    API_ENDPOINT.postHostFeedback,
    data,
    token && attachToken(token),
  );
};

export const getLiveFeedback = ({ since, token }) => {
  const payload =
    typeof since === "number" && Number.isFinite(since) ? { since } : null;
  const authorization = token ? attachToken(token) : null;
  return getJson(API_ENDPOINT.getLiveFeedback, payload, authorization);
};
