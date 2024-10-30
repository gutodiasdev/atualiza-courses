"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "./actions";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

export const signInSchema = z.object({
  email: z.string().email("Você deve inserir um email válido").min(3).max(255),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 8 caracteres" }).max(100),
});

export default function Page() {
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema)
  });

  const signInMutation = useMutation({
    mutationFn: async (values: any) => {
      await signIn(values);
    },
    mutationKey: ["sign_in_form"],
    onSuccess: () => {
      toast.success("Logado com sucesso!", { duration: 2000 });
      router.push("/dashboard");
    },
    onError: (error: any, variables, context) => {
      console.log("Error: ", error.response.data.message);
      console.log("Valiables: ", variables);
      console.log("Context: ", context);
      toast.error(error.response.data.message, { duration: 2000 });
    }
  });

  const onSubmit: SubmitHandler<z.infer<typeof signInSchema>> = async (values): Promise<void> => {
    await signInMutation.mutateAsync(values);
  };

  return (
    <main>
      <section className="h-screen grid place-items-center text-center">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="text-gray-200 min-w-96 space-y-4 bg-gray-900 px-8 pt-4 pb-10 rounded-md">
              <div className="w-fill flex justify-center items-center">
                <div className="relative w-36 h-20">
                  <Image
                    src="./logo.svg"
                    alt="AtualizaDigital"
                    fill
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="atualiza@mail.com.br" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-green-500 w-full text-gray-900 hover:bg-green-800 hover:text-white"
                disabled={signInMutation.isPending}>
                {
                  signInMutation.isPending ? (
                    <div className="animate-spin">
                      <LoaderCircle className="w-16 h-16" />
                    </div>
                  ) : null
                }
                {
                  signInMutation.isPending ? "Entrando" : "Entrar"
                }
              </Button>
            </form>
          </Form>
          <Link href="#" className="text-gray-300 text-xs">
            Esqueceu a senha?
          </Link>
        </div>
      </section>
    </main>
  );
}
