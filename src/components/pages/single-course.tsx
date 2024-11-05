"use client";

import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";

type Props = {
  courseId: string;
};

export default function SingleCourse(props: Props) {
  const { user } = useUser();

  const query = useQuery({
    queryKey: ["course", props.courseId, user.id],
    queryFn: async () => {
      const { data } = await api.get("/student/courses/" + props.courseId, { authorization: true });
      return data;
    }
  });

  if (query.isLoading) {
    return (
      <p>is loading...</p>
    );
  }

  return (
    <div className="space-y-4">
      {JSON.stringify(query.data)}
      <section className="flex item-center justify-end gap-x-4">
        <Button variant="outline" >
          <CheckCircle />
          Solicitar aprovação
        </Button>
      </section>
      <section>
        <div className="border border-gray-700 rounded-lg h-80">
        </div>
      </section>
    </div>
  );
}