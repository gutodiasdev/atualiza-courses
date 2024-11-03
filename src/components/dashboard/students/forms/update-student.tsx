"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import passwordGenerator from "@/lib/security/passwordGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, CopyIcon, KeyRound, Pencil } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { STATUS } from "../columns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type UpdateStudentFormInput = {
  student: {
    id: number;
    name: string;
    status: keyof typeof STATUS;
    email: string;
    created_at: string;
    updated_at: string;
  };
};

const schema = z.object({
  name: z.string({ message: "Nome do usuário é obrigatório" }).optional(),
  status: z.string({ message: "Nome do usuário é obrigatório" }).optional(),
  email: z.string().email("Você precisa inserir um email válido").optional(),
  password: z.string({ message: "Senha é obrigatório" }).min(6, "A senha precisa ter no mínimo 6 caracteres").optional()
});

export function UpdateStudentForm({ student }: UpdateStudentFormInput) {
  const { user } = useUser();
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: student.name,
      email: student.email,
      status: student.status,
      password: ""
    }
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
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const generatePassword = () => {
    form.setValue("password", passwordGenerator());
  };

  const copyToClipboard = async () => {
    if (form.getValues().password?.length === 0) return null;
    await navigator.clipboard.writeText(form.getValues().password as string);
  };

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (values) => {
    await mutation.mutateAsync(values);
  };

  return (
    <div className="w-full flex items-center justify-end">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" onClick={() => setOpen(true)} variant="ghost" size="icon">
            <Pencil />
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
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um status para o aluno" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="approved">Aprovado</SelectItem>
                        <SelectItem value="rejected">Rejeitar</SelectItem>
                      </SelectContent>
                    </Select>
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
                Atualizar aluno
              </Button>
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </div>
  );
}