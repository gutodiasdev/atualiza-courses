"use client";

import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useUser } from "@/lib/auth";
import { api } from "@/lib/api";
import { LoaderIcon } from "lucide-react";

type Props = {
  courseId: string;
  moduleId: string;
};

export function LessonsTable(props: Props) {
  const { user } = useUser();

  const getModules = async () => {
    const { data } = await api.get(`/courses/${props.courseId}/modules/${props.moduleId}/lessons`, {
      authorization: true
    });
    return data;
  };

  const query = useQuery({
    queryKey: ["course_module_lessons", props.moduleId, user.id],
    queryFn: getModules
  });

  if (query.isLoading) return <LoaderIcon className="animate-spin" />;

  return <DataTable columns={columns} data={query.data} />;
}