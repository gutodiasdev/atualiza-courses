"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EnrollmentRequest } from "@/lib/@types";
import { AcceptOrRejectRequestForm } from "./forms/accept-or-reject-request";

export const columns: ColumnDef<EnrollmentRequest>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "courses.name",
    header: "Nome do curso",
  },
  {
    accessorKey: "users.name",
    header: "Nome do aluno",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <AcceptOrRejectRequestForm enrollment_request={row.original}/>
    }
  },
];
