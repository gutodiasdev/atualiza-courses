"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { List } from "lucide-react";
import Link from "next/link";
import { UpdateModuleForm } from "../forms/update-module";


export type Module = {
  id: number;
  course_id: number;
  name: string;
  description: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export const columns: ColumnDef<Module>[] = [
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
    accessorKey: "lessons",
    header: "Lições",
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Link href={`/dashboard/cursos/${row.original.course_id}/modulos/${row.original.id}`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="ghost">
                    <List />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Editar lições
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
        </div>
      );
    }
  },
  {
    accessorKey: "actions",
    header: "Editar",
    cell: ({ row }) => {
      return <UpdateModuleForm module={row.original}/>
    }
  },
];
