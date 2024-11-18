"use client";

import { ContentLayout } from "@/components/dashboard/content-layout";
import { useAWSUploadImage } from "@/components/dashboard/courses/forms/upload-course-image";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, X } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  name: z.string({ message: "Nome do módulo é obrigatório" }),
  description: z.string({ message: "Descrição do módulo é obrigatório" }),
  image: z.string({ message: "Imagem é obrigatório" })
});

export default function Page() {
  const params = useParams() as { id: string; };
  const { user } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      image: ""
    }
  });

  const imageUploader = useAWSUploadImage();

  const mutation = useMutation({
    mutationKey: ["add_course", user?.id],
    mutationFn: async (values: z.infer<typeof schema>) => {
      const upload = await imageUploader.mutateAsync({
        userId: user?.id as number,
        image: imageFile as File
      });
      await api.post(`/courses/${params.id}/modules`, {
        ...values,
        image: upload.imageAwsURL,
      }, { authorization: true });
    },
    onSuccess: () => {
      toast.success("Módulo adicionado com sucesso!", { duration: 2000 });
      queryClient.invalidateQueries({ queryKey: ["course_modules", { id: params.id }], exact: true },);
      router.push(`/dashboard/cursos/${params.id}`);
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
    <ContentLayout>
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
          <Button type="submit" className="right-0" disabled={mutation.isPending} variant="outline">
            {
              mutation.isPending ? (
                <div className="animate-spin">
                  <LoaderCircle className="w-16 h-16" />
                </div>
              ) : null
            }
            {
              mutation.isPending ? "Criando módulo" : "Adicionar módulo"
            }
          </Button>
        </form>
      </Form>
    </ContentLayout>
  );
}