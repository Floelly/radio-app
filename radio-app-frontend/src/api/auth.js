import { API_ENDPOINT } from "@/config/api-config";
import { postJson } from "./http";

export const register = async ({ email, password }) => {
  return postJson(API_ENDPOINT.postRegister, { email, password });
};

export const login = async ({ email, password }) => {
  return postJson(API_ENDPOINT.postLogin, { email, password });
};
