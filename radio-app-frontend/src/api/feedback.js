import { getJson, postJson } from "./http";

export const postFeedbackPlaylist = ({ data, token = null }) => {
  return postJson("/feedback/playlist", data, token && `Bearer ${token}`);
};

export const postFeedbackHost = ({ data, token = null }) => {
  return postJson("/feedback/host", data, token && `Bearer ${token}`);
};

export const getLiveFeedback = ({ since, token }) => {
  const payload =
    typeof since === "number" && Number.isFinite(since) ? { since } : null;
  const authorization = token ? `Bearer ${token}` : null;
  return getJson("/live/feedback", payload, authorization);
};
