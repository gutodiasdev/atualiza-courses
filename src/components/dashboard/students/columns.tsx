"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";


export type Student = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "created_at",
    header: "Criado em",
    cell: ({ row }) => {
      const formatted = dayjs(row.original.created_at).format("D/M/YYYY");
      return <p>{formatted}</p>;
    }
  },
];
