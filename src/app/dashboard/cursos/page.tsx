"use client";

import { ContentLayout } from "@/components/dashboard/content-layout";
import { columns } from "@/components/dashboard/courses/columns";
import { DataTable } from "@/components/dashboard/courses/data-table";
import { useUploadCourseImage } from "@/components/dashboard/courses/forms/upload-course-image";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CheckCircle, GraduationCap, LoaderCircle, RefreshCcw, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  name: z.string({ message: "Nome do curso é obrigatório" }),
  description: z.string({ message: "Descrição do curso é obrigatório" }),
  image: z.string({ message: "Imagem é obrigatório" })
});

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);

  const uploadCourseImageMutation = useUploadCourseImage();

  const query = useQuery<any, AxiosError>({
    queryKey: ["courses", user?.id],
    queryFn: async () => {
      const { data } = await api.get("/courses", {
        authorization: true
      });
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.error?.status === 401) {
      router.push("/");
    }
  }, [query]);

  const mutation = useMutation({
    mutationKey: ["add_course", user?.id],
    mutationFn: async (values: z.infer<typeof schema>) => {
      const { imageAwsURL } = await uploadCourseImageMutation.mutateAsync({
        userId: user?.id as number,
        image: imageFile as File
      });
      await api.post("/courses", {
        ...values,
        image: imageAwsURL,
        teacher_id: user?.id
      }, { authorization: true });
    },
    onSuccess: () => {
      toast.success("Curso adicionado com sucesso!", { duration: 2000 });
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
      description: "",
      image: ""
    }
  });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (values) => {
    await mutation.mutateAsync(values);
  };

  const handleRefetch = () => {
    query.refetch();
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

  console.log();

  return (
    <ContentLayout>
      <section className="flex item-center justify-end gap-x-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <GraduationCap />
              Adicionar curso
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
                <Button variant="outline" className="right-0" type="submit" disabled={uploadCourseImageMutation.isPending || mutation.isPending}>
                  {
                    (uploadCourseImageMutation.isPending || mutation.isPending) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw animate-spin"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg>
                    ) : <CheckCircle />
                  }
                  Adicionar curso
                </Button>
              </form>
            </Form>
          </PopoverContent>
        </Popover>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" onClick={handleRefetch} size="icon" variant="outline">
                <RefreshCcw />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Atualizar dados
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </section>
      <section className="py-4">
        {
          query.isFetching ? (
            <div className="border border-gray-900 rounded-md flex justify-center h-96 items-center">
              <LoaderCircle className="animate-spin" />
            </div>
          ) : (
            <DataTable columns={columns} data={query.data} />
          )
        }
      </section>
    </ContentLayout>
  );
}