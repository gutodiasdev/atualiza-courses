"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CheckCircle, CircleX } from "lucide-react";
import { STATUS } from "../columns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/lib/auth";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { useState } from "react";

type Props = {
  currentStatus: keyof typeof STATUS;
  studentId: number;
};

export function AcceptOrRejectStudentForm(props: Props) {
  const { user } = useUser();
  const [open, setOpen] = useState<boolean>(false);
  const query = useQueryClient();

  const approveMutation = useMutation({
    mutationKey: ["accept__student", user.id],
    mutationFn: async () => {
      await api.put(`/teacher/student/${props.studentId}/status`, { status: "approved" }, { authorization: true });
    },
    onSuccess: () => {
      toast.success("Aluno atualizado com sucesso!");
      query.invalidateQueries({ queryKey: ["students", user.id] });
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const rejectMutation = useMutation({
    mutationKey: ["reject_student", user.id],
    mutationFn: async () => {
      await api.put(`/teacher/student/${props.studentId}/status`, { status: "rejected" }, { authorization: true });
    },
    onSuccess: () => {
      toast.success("Aluno atualizado com sucesso!");
      query.invalidateQueries({ queryKey: ["students", user.id] });
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const handleApproveStudent = async (): Promise<void> => {
    await approveMutation.mutateAsync()
  }
  const handleRejectStudent = async (): Promise<void> => {
    await rejectMutation.mutateAsync()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Badge className="rounded-full cursor-pointer" variant={props.currentStatus}>
          {STATUS[props.currentStatus]}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="z-50 mt-2 p-2 min-w-40 bg-gray-900 rounded-md border border-gray-800 space-x-4">
        <Button variant="outline" type="button" onClick={handleApproveStudent}>
          <CheckCircle />
          Aprovar
        </Button>
        <Button variant="destructive" type="button" onClick={handleRejectStudent}>
          <CircleX />
          Rejeitar
        </Button>
      </PopoverContent>
    </Popover>
  );
}