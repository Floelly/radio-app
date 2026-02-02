import { postJson } from "./http";

export const register = async ({ email, password }) => {
  return postJson("/register", { email, password });
};

export const login = async ({ email, password }) => {
  return postJson("/login", { email, password });
};
