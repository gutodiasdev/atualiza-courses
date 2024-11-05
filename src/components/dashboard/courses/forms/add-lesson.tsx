"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookPlus, CheckCircle } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type Props = {
  courseId: string;
  moduleId: string;
};

const schema = z.object({
  name: z.string({ message: "Nome do usuário é obrigatório" }),
  description: z.string({ message: "Descrição do curso é obrigatório" }),
  video_url: z.string({ message: "Descrição do curso é obrigatório" }).optional()
});

export function AddLessonForm(props: Props) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);

  const mutation = useMutation({
    mutationKey: ["add_course", user.id],
    mutationFn: async (values: z.infer<typeof schema>) => {
      await api.post(`/courses/${props.courseId}/modules/${props.moduleId}/lessons`, values, { authorization: true });
    },
    onSuccess: () => {
      toast.success("Módulo adicionado com sucesso!", { duration: 2000 });
      queryClient.invalidateQueries({ queryKey: ["course_module_lessons", props.courseId, props.moduleId, user.id] });
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
      description: "",
      video_url: ""
    }
  });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (values) => {
    await mutation.mutateAsync(values);
  };

  return (
    <section>
      <section className="flex item-center justify-end gap-x-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <BookPlus />
              Adicionar lição
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
                      <FormLabel>Nome da lição</FormLabel>
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
                      <FormLabel>Descrição da lição</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="video_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL vídeo da lição (opicional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button variant="outline" className="right-0" type="submit">
                  <CheckCircle />
                  Adicionar lição
                </Button>
              </form>
            </Form>
          </PopoverContent>
        </Popover>
      </section>
    </section>
  );
}