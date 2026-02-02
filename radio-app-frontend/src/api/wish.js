import { postJson } from "./http";

export const postSongWish = ({ data, token = null }) => {
  return postJson("/wish", data, token && `Bearer ${token}`);
};
