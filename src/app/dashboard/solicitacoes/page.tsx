"use client";

import { ContentLayout } from "@/components/dashboard/content-layout";
import { columns } from "@/components/dashboard/enrollment-requests/columns";
import { DataTable } from "@/components/dashboard/enrollment-requests/data-table";
import { EnrollmentRequest } from "@/lib/@types";
import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { LoaderCircle } from "lucide-react";

export default function Page() {
  const { user } = useUser();
  const query = useQuery<EnrollmentRequest[], AxiosError>({
    queryKey: ["students_enrollment_requests", { teacherId: user?.id }],
    queryFn: async () => {
      const { data } = await api.get("/courses/enrollment_requests", { authorization: true });
      return data;
    },
    staleTime: 1000 * 60 * 5
  });

  return (
    <ContentLayout>
      <section className="py-4">
        {
          query.isFetching ? (
            <div className="border border-gray-900 rounded-md flex justify-center h-96 items-center">
              <LoaderCircle className="animate-spin" />
            </div>
          ) : (
            <DataTable columns={columns} data={query.data as EnrollmentRequest[]} />
          )
        }
      </section>
    </ContentLayout>
  );
}