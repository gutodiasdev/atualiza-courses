"use client";

import { ContentLayout } from "@/components/dashboard/content-layout";
import { columns } from "@/components/dashboard/courses/columns";
import { DataTable } from "@/components/dashboard/courses/data-table";
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
import { CheckCircle, GraduationCap, LoaderCircle, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  const query = useQuery<any, AxiosError>({
    queryKey: ["courses", user.id],
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
    mutationKey: ["add_course", user.id],
    mutationFn: async (values: z.infer<typeof schema>) => {
      await api.post("/courses", { ...values, teacher_id: user.id }, { authorization: true });
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

  return (
    <ContentLayout title="Cursos">
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button variant="outline" className="right-0" type="submit">
                  <CheckCircle />
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