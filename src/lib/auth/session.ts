"use server";

import { cookies } from "next/headers";
import { api } from "../api";

export async function signToken(): Promise<{ token: string; }> {
  const cookiesStorage = await cookies();
  const { data } = await api.get<{ token: string; }>("/sign_token", {
    headers: {
      Authorization: "Bearer " + cookiesStorage.get("session")?.value
    }
  });
  return { token: data.token };
}

export async function verifyToken(): Promise<{ user: number, roles: string; }> {
  const cookiesStorage = await cookies();
  const { data, status } = await api.get("/verify_token", {
    headers: {
      Authorization: "Bearer " + cookiesStorage.get("session")?.value
    }
  });
  if (status === 401) {
    throw new Error("Token inválido!");
  }

  return data;
}

export async function getSession() {
  const cookiesStorage = await cookies();
  const session = cookiesStorage.get("session")?.value;
  if (!session) return null;
  return await verifyToken();
}

export async function setSession() {
  const expiresInOneHour = new Date(Date.now() + 60 * 60 * 1000);
  const { token } = await signToken();
  const cookiesStorage = await cookies();
  cookiesStorage.set(
    "session",
    token,
    {
      expires: expiresInOneHour,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
}