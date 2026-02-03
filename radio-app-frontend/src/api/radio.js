import { API_ENDPOINT } from "@/config/api-config";
import { getJson } from "./http";

export const getCurrentTrack = () => getJson(API_ENDPOINT.getCurrentTrack);

export const getCurrentPlaylist = () =>
  getJson(API_ENDPOINT.getCurrentPlaylist);

export const getCurrentQueue = () => getJson(API_ENDPOINT.getCurrentQueue);

export const getCurrentHost = () => getJson(API_ENDPOINT.getCurrentHost);
