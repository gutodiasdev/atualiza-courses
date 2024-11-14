"use client";

import { ContentLayout } from "@/components/dashboard/content-layout";
import { useUploadCourseImage } from "@/components/dashboard/courses/forms/upload-course-image";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  name: z.string({ message: "Nome do curso é obrigatório" }),
  description: z.string({ message: "Descrição do curso é obrigatório" }),
  image: z.string({ message: "Imagem é obrigatório" }),
  background_image: z.string().optional(),
});


export default function Page() {
  const { user } = useUser();
  const query = useQueryClient();
  const [, setOpen] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string | ArrayBuffer | null>(null);

  const uploadCourseImageMutation = useUploadCourseImage();

  const mutation = useMutation({
    mutationKey: ["add_course", user?.id],
    mutationFn: async (values: z.infer<typeof schema>) => {
      const gridImage = await uploadCourseImageMutation.mutateAsync({
        userId: user?.id as number,
        image: imageFile as File
      });
      const backgroundImage = await uploadCourseImageMutation.mutateAsync({
        userId: user?.id as number,
        image: backgroundImageFile as File
      });
      await api.post("/courses", {
        ...values,
        image: gridImage.imageAwsURL,
        background_image: backgroundImage.imageAwsURL,
        teacher_id: user?.id
      }, { authorization: true });
    },
    onSuccess: () => {
      toast.success("Curso adicionado com sucesso!", { duration: 2000 });
      setOpen(false);
      query.invalidateQueries({ queryKey: ["courses", user?.id], exact: true });
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
      image: ""
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

  const handleBackgroundImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setBackgroundImageFile(file);
        setBackgroundImagePreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  return (
    <ContentLayout>
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
                <FormLabel>Descrição do curso</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagem grade de cursos (Tamanho sugerido: 195x400px)</FormLabel>
                  <FormControl>
                    <div className="flex flex-col w-full max-w-sm gap-4 y-4 mb-4">
                      {
                        imagePreview ? (
                          <>
                            <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Imagem</p>
                            <div className="relative w-full h-[400px] border">
                              <Button size="sm" className="rounded-full absolute z-20 -right-1 -top-1" variant="destructive" onClick={handleRemoveImage}>
                                <X size={12} />
                              </Button>
                              <Image src={imagePreview as string} alt="preview" fill objectFit="contain" />
                            </div>
                          </>
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
            <FormField
              control={form.control}
              name="background_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagem principal do curso (Tamanho sugerido: 1920x1080px)</FormLabel>
                  <FormControl>
                    <div className="flex flex-col w-full max-w-sm gap-4 y-4 mb-4">
                      {
                        backgroundImagePreview ? (
                          <>
                            <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Imagem</p>
                            <div className="relative w-full h-[400px] border">
                              <Button size="sm" className="rounded-full absolute z-20 -right-1 -top-1" variant="destructive" onClick={handleRemoveImage}>
                                <X size={12} />
                              </Button>
                              <Image src={backgroundImagePreview as string} alt="preview" fill objectFit="contain" />
                            </div>
                          </>
                        ) : (
                          <Input id="picture" type="file" {...field} onChange={handleBackgroundImageChange} />
                        )
                      }
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" className="right-0" type="submit" disabled={uploadCourseImageMutation.isPending || mutation.isPending}>
              {
                (uploadCourseImageMutation.isPending || mutation.isPending) ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw animate-spin"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg>
                ) : <CheckCircle />
              }
              Criar curso
            </Button>
          </div>
        </form>
      </Form>
    </ContentLayout>
  );
}