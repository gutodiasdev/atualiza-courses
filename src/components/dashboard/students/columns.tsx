"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { UpdateStudentForm } from "./forms/update-student";
import { AcceptOrRejectStudentForm } from "./forms/accept-or-reject-student";


export type Student = {
  id: number;
  name: string;
  email: string;
  status: keyof typeof STATUS;
  created_at: string;
  updated_at: string;
};

export enum STATUS {
  pending = "Pendente",
  approved = "Aprovado",
  rejected = "Rejeitado"
}

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
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <AcceptOrRejectStudentForm currentStatus={row.original.status} studentId={row.original.id}/>
    }
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      return <UpdateStudentForm student={row.original}/>
    }
  },
];
