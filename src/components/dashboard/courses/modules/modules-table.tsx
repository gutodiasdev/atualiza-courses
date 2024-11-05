"use client";

import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useUser } from "@/lib/auth";
import { api } from "@/lib/api";
import { LoaderIcon } from "lucide-react";

type Props = {
  courseId: string;
};

export function ModulesTable(props: Props) {
  const { user } = useUser();

  const getModules = async () => {
    const { data } = await api.get(`/courses/${props.courseId}/modules`, { authorization: true });
    return data;
  };

  const query = useQuery({
    queryKey: ["course_modules", props.courseId, user.id],
    queryFn: getModules
  });

  if (query.isLoading) {
    return (
      <div className="border border-gray-900 rounded-md flex justify-center h-96 items-center">
        <LoaderIcon className="animate-spin" />
      </div>
    );
  }

  return <DataTable columns={columns} data={query.data} />;
}