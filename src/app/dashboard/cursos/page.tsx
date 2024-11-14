"use client";

import { ContentLayout } from "@/components/dashboard/content-layout";
import { columns } from "@/components/dashboard/courses/columns";
import { DataTable } from "@/components/dashboard/courses/data-table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { GraduationCap, LoaderCircle, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

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

  const handleRefetch = () => {
    query.refetch();
  };

  return (
    <ContentLayout>
      <section className="flex item-center justify-end gap-x-4">
        <Link href="/dashboard/cursos/criar">
          <Button variant="outline">
            <GraduationCap />
            Adicionar curso
          </Button>
        </Link>
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