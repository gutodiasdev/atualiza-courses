"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Pencil, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type UpdateCourseFormInput = {
  course: {
    id: number;
    name: string;
    image: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
};

const schema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export function UpdateCourseForm({ course }: UpdateCourseFormInput) {
  const { user } = useUser();
  const query = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(course.image);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: course.name,
      description: course.description,
      image: course.image
    }
  });

  const mutation = useMutation({
    mutationKey: ["update_course", course.id, user?.id],
    mutationFn: async (values: z.infer<typeof schema>) => {
      await api.put(`/courses/${course.id}`, { ...values, teacher_id: user?.id }, { authorization: true });
    },
    onSuccess: () => {
      toast.success("Curso atualizado com sucesso");
      query.invalidateQueries({ queryKey: ["courses", user?.id] });
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (values) => {
    await mutation.mutateAsync(values);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageFile(file);
        setImagePreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  return (
    <div className="w-full flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" onClick={() => setOpen(true)} variant="ghost" size="icon">
            <Pencil />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="mr-8 min-w-[480px] bg-gray-900" avoidCollisions>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do curso</FormLabel>
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
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagem do curso</FormLabel>
                    <FormControl>
                      <div className="flex flex-col w-full max-w-sm gap-4 y-4 mb-4">
                        {
                          imagePreview ? (
                            <div className="relative w-full h-[400px] border">
                              <Button size="sm" className="rounded-full absolute z-20 -right-1 -top-1" variant="destructive" onClick={handleRemoveImage}>
                                <X size={12} />
                              </Button>
                              <Image src={imagePreview as string} alt="preview" fill objectFit="contain" />
                            </div>
                          ) : (
                            <Input id="picture" type="file" {...field} onChange={handleImageChange} />
                          )
                        }
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button variant="outline" className="right-0" type="submit">
                <CheckCircle />
                Atualizar módulo
              </Button>
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </div>
  );
}