import { setSession } from "@/lib/auth/session";
import { signInSchema } from "./page";
import { z } from "zod";
import { api } from "@/lib/api";

export const signIn = async (data: z.infer<typeof signInSchema>) => {
  const { data: response } = await api.post<{ token: string }>("/login", data);
  if (!response.token) {
    return { error: "Senha ou email inválidos. Tente novamente" };
  }

  await Promise.all([
    setSession(),
  ]);
};