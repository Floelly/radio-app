import { API_ENDPOINT } from "@/config/api-config";
import { postJson } from "./http";

export const postSongWish = ({ data, token = null }) => {
  return postJson(API_ENDPOINT.wishASong, data, token && `Bearer ${token}`);
};
