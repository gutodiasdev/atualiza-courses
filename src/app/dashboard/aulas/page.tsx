"use client";

import { ContentLayout } from "@/components/dashboard/content-layout";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Course = {
  created_at: string;
  description: string;
  id: number;
  image: string;
  isApproved: number;
  name: string;
  teacher_id: number;
  updated_at: string;
};

export default function Page() {
  const { user } = useUser();

  const query = useQuery<{ enrolled: Course[], not_enrolled: Course[]; }, AxiosError>({
    queryKey: ["student_courses", user.id],
    queryFn: async () => {
      const { data } = await api.get("/student/courses", { authorization: true });
      return data;
    },
    staleTime: 1000 * 60 * 5
  });

  return (
    <ContentLayout title="Aulas">
      <section className="pt-6">
        <div className="flex w-full">
          <h1 className="text-sm font-normal">
            Cursos aceitos
          </h1>
        </div>
        <div className="grid xl:grid-cols-4 gap-4 pt-6">
          {
            query.isFetching ? (
              <div>
                <p>123</p>
              </div>
            ) : query.isError ? (
              <div>
                <p>123</p>
              </div>
            ) : (
              query.data?.enrolled.map((course: Course) => (
                <Link key={course.id} href={`/dashboard/aulas/curso/${course.id}`}>
                  <div className="border rounded-lg border-gray-700n overflow-hidden">
                    <div className="relative w-auto h-48">
                      <Image src={course.image} alt={course.name} fill />
                    </div>
                    <div className="p-4 space-y-4">
                      <h2 className="text-lg font-semibold">
                        {course.name}
                      </h2>
                      <p className="text-sm font-normal">
                        {course.description}
                      </p>
                      <div className="flex gap-x-2 items-center">

                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )
          }
        </div>
      </section>
      <section className="pt-6">
        <div className="flex w-full pb-4">
          <h1 className="text-sm font-normal">
            Todos os cursos
          </h1>
        </div>
        <div className="grid xl:grid-cols-4 gap-4">
          {
            query.isFetching ? (
              <div>
                <p>123</p>
              </div>
            ) : query.isError ? (
              <div>
                <p>123</p>
              </div>
            ) : (
              query.data?.not_enrolled.map((course: Course) => (
                <Link key={course.id} href={`/dashboard/aulas/curso/${course.id}`}>
                  <div className="border rounded-lg border-gray-700n overflow-hidden">
                    <div className="relative w-auto h-48">
                      <Image src={course.image} alt={course.name} fill />
                    </div>
                    <div className="p-4 space-y-4">
                      <h2 className="text-lg font-semibold">
                        {course.name}
                      </h2>
                      <p className="text-sm font-normal">
                        {course.description}
                      </p>
                      <div className="flex gap-x-2 items-center justify-end">
                        <Button variant="outline" >
                          <CheckCircle />
                          Solicitar aprovação
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )
          }
        </div>
      </section>
    </ContentLayout>
  );
}