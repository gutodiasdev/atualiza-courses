"use server";

import { cookies } from "next/headers";
import { api } from "../api";
import { redirect } from "next/navigation";

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

export async function getUser(): Promise<{ user: number, roles: string; } | null> {
  const cookiesStorage = await cookies();
  const token = cookiesStorage.get("session")?.value;
  if (!token) {
    return null;
  }
  
  const { data, status } = await api.get("/me", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token
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

export async function setSession(token: string) {
  const expiresInOneHour = new Date(Date.now() + 60 * 60 * 1000);
  const cookiesStorage = await cookies();
  cookiesStorage.set(
    "session",
    token,
    {
      expires: expiresInOneHour,
      secure: true,
      sameSite: 'lax',
    });
}

export async function signOut() {
  const cookiesStorage = await cookies();
  cookiesStorage.delete("session");
  redirect("/");
}

export async function getToken(): Promise<string | undefined> {
  const cookiesStorage = await cookies();
  const token = cookiesStorage.get("session")?.value;
  return token;
}