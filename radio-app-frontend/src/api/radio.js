import { getJson } from "./http";

export const getCurrentTrack = () => getJson("/current-track");

export const getCurrentPlaylist = () => getJson("/current-playlist");

export const getCurrentQueue = () => getJson("/current-queue");

export const getCurrentHost = () => getJson("/current-host");
