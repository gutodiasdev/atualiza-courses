"use client";

import { ContentLayout } from "@/components/dashboard/content-layout";
import { columns } from "@/components/dashboard/students/columns";
import { DataTable } from "@/components/dashboard/students/data-table";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import passwordGenerator from "@/lib/security/passwordGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle, CopyIcon, KeyRound, LoaderCircle, UserPlus } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  name: z.string({ message: "Nome do usuário é obrigatório" }),
  email: z.string().email("Você precisa inserir um email válido"),
  password: z.string({ message: "Senha é obrigatório" }).min(6, "A senha precisa ter no mínimo 6 caracteres")
});

export default function Page() {
  const { user } = useUser();
  const [open, setOpen] = useState<boolean>(false);

  const query = useQuery({
    queryKey: ["students", user.id],
    queryFn: async () => {
      const { data } = await api.get("/clientes/student", {
        authorization: true
      });
      return data;
    },
    staleTime: 1000 * 60 * 5
  });

  const mutation = useMutation({
    mutationKey: ["add_student", user.id],
    mutationFn: async (values: z.infer<typeof schema>) => {
      const teacherId = Number(user.id);
      await api.post("/user", { ...values, role: "student", teacher_id: teacherId }, { authorization: true });
    },
    onSuccess: () => {
      toast.success("Aluno adicionado com sucesso!");
      setOpen(false);
      query.refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (values) => {
    await mutation.mutateAsync(values);
  };

  const generatePassword = () => {
    form.setValue("password", passwordGenerator());
  };

  const copyToClipboard = async () => {
    if (form.getValues().password.length === 0) return null;
    await navigator.clipboard.writeText(form.getValues().password);
  };

  return (
    <ContentLayout title="Alunos">
      <section className="flex item-center justify-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <UserPlus />
              Adicionar aluno
            </Button>
          </PopoverTrigger>
          <PopoverContent className="mr-8 min-w-[480px] bg-gray-900">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do usuário</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email do usuário</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-end gap-x-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="outline" onClick={generatePassword} type="button">
                          <KeyRound />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Gerar senha
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="outline" onClick={copyToClipboard} type="button">
                          <CopyIcon />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Copiar senha
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Button variant="outline" className="right-0" type="submit">
                  <CheckCircle />
                  Adicionar aluno
                </Button>
              </form>
            </Form>
          </PopoverContent>
        </Popover>
      </section>
      <section className="py-4">
        {
          query.isFetching ? (
            <div className="border border-gray-900 rounded-md flex justify-center h-96 items-center">
                <LoaderCircle  className="animate-spin"/>
            </div>
          ) : (
            <DataTable columns={columns} data={query.data} />
          )
        }
      </section>
    </ContentLayout>
  );
}