"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { UpdateLessonForm } from "../../forms/update-lesson";


export type Lesson = {
  id: number;
  course_module_id: number;
  name: string;
  video_url: string;
  video_thumb: string| null;
  description: string;
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<Lesson>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "description",
    header: "Descrição  ",
  },
  {
    accessorKey: "created_at",
    header: "Criado em",
    cell: ({ row }) => {
      const formatted = dayjs(row.original.created_at).format("D/M/YYYY");
      return <p>{formatted}</p>;
    }
  },
  {
    accessorKey: "actions",
    header: "Editar",
    cell: ({ row }) => {
      return <UpdateLessonForm lesson={row.original} />;
    }
  },
];
