import { getCookie } from "cookies-next";
import { decode } from "jsonwebtoken";

export function readTokenPayload() {
  const token = getCookie("session");
  const decoded = decode(token as string);
  return decoded;
}