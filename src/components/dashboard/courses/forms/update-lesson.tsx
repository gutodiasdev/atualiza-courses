"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Pencil } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type UpdateLessonFormInput = {
  lesson: {
    id: number;
    course_module_id: number;
    name: string;
    video_url: string;
    video_thumb: string| null;
    description: string;
    created_at: string;
    updated_at: string;
  };
};

const schema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  video_url: z.string().optional(),
  video_thumb: z.string().optional(),
});

export function UpdateLessonForm({ lesson }: UpdateLessonFormInput) {
  const { user } = useUser();
  const query = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: lesson.name,
      description: lesson.description,
      video_thumb: lesson.video_thumb || "",
      video_url: lesson.video_url
    }
  });

  const mutation = useMutation({
    mutationKey: ["update_course_module", module.id, user.id],
    mutationFn: async (values: z.infer<typeof schema>) => {
      await api.put(`/courses/modules/${lesson.course_module_id}/lessons/${lesson.id}`, values, { authorization: true });
    },
    onSuccess: () => {
      toast.success("Curso atualizado com sucesso");
      query.invalidateQueries({ queryKey: ["course_module_lessons", lesson.course_module_id, user.id] })
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (values) => {
    await mutation.mutateAsync(values);
  };

  return (
    <div className="w-full flex items-center">
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
                    <FormLabel>URL o vídeo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button variant="outline" className="right-0" type="submit">
                <CheckCircle />
                Atualizar lição
              </Button>
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </div>
  );
}