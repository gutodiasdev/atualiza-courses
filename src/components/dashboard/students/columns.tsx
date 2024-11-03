"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CheckCircle, CircleX } from "lucide-react";
import { UpdateStudentForm } from "./forms/update-student";


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
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Badge className="rounded-full cursor-pointer" variant={row.original.status}>
              {STATUS[row.original.status]}
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="z-50 mt-2 p-2 min-w-40 bg-gray-900 rounded-md border border-gray-800 space-x-4">
            <Button variant="outline">
              <CheckCircle />
              Aprovar
            </Button>
            <Button variant="destructive">
              <CircleX />
              Rejeitar
            </Button>
          </PopoverContent>
        </Popover>
      );
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
