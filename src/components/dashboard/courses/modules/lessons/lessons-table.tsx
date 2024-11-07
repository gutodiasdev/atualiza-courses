"use client";

import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { api } from "@/lib/api";
import { LoaderIcon } from "lucide-react";

type Props = {
  courseId: string;
  moduleId: string;
};

export function LessonsTable(props: Props) {
  const getModules = async () => {
    const { data } = await api.get(`/courses/${props.courseId}/modules/${props.moduleId}/lessons`, {
      authorization: true
    });
    return data;
  };

  const query = useQuery({
    queryKey: ["course_module_lessons", { id: props.moduleId }],
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