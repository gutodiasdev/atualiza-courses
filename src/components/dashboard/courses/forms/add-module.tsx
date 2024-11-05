"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, BookPlus, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type Props = {
  courseId: string;
};

const schema = z.object({
  name: z.string({ message: "Nome do módulo é obrigatório" }),
  description: z.string({ message: "Descrição do módulo é obrigatório" }),
});

export function AddModuleForm(props: Props) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);

  const mutation = useMutation({
    mutationKey: ["add_course", user.id],
    mutationFn: async (values: z.infer<typeof schema>) => {
      await api.post(`/courses/${props.courseId}/modules`, values, { authorization: true });
    },
    onSuccess: () => {
      toast.success("Módulo adicionado com sucesso!", { duration: 2000 });
      queryClient.invalidateQueries({ queryKey: ["course_modules", props.courseId, user.id] });
      form.reset();
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: ""
    }
  });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (values) => {
    await mutation.mutateAsync(values);
  };

  return (
    <section>
      <section className="flex item-center justify-between gap-x-4 py-4">
        <Link href="/dashboard/cursos">
          <Button type="button" size="icon" variant="outline">
            <ArrowLeft />
          </Button>
        </Link>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <BookPlus />
              Adicionar módulo
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
                      <FormLabel>Nome do módulo</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição do módulo</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button variant="outline" className="right-0" type="submit">
                  <CheckCircle />
                  Adicionar módulo
                </Button>
              </form>
            </Form>
          </PopoverContent>
        </Popover>
      </section>
    </section>
  );
}