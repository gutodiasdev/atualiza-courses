"use client";

import { ContentLayout } from "@/components/dashboard/content-layout";
import { CoursesCarousel } from "@/components/dashboard/courses-carousel";
import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

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
  const query = useQuery<{ enrolled: Course[], not_enrolled: Course[]; pending_requests: Course[]; }, AxiosError>({
    queryKey: ["student_courses", user?.id],
    queryFn: async () => {
      const { data } = await api.get("/student/courses", { authorization: true });
      return data;
    },
    staleTime: 1000 * 60 * 5
  });

  if (query.isLoading) {
    return <p>TODO: isLoading</p>;
  }

  if (query.isError) {
    return <p>TODO: isError</p>;
  }

  return (
    <ContentLayout>
      <section className="mb-4">
        <div className="flex w-full pb-2">
          <h2 className="text-sm font-semibold uppercase">
            Meus cursos
          </h2>
        </div>
        <div className="flex w-full">
          <CoursesCarousel courses={query.data?.enrolled as Course[]} />
        </div>
      </section>
      <section>
        <div className="flex w-full pb-2">
          <h2 className="text-sm font-semibold uppercase">
            Solicitações pendentes
          </h2>
        </div>
        <div className="flex w-full">
          <CoursesCarousel courses={query.data?.pending_requests as Course[]} />
        </div>
      </section>
      <section>
        <div className="flex w-full pb-2">
          <h2 className="text-sm font-semibold uppercase">
            Todos os cursos
          </h2>
        </div>
        <div className="flex w-full">
          <CoursesCarousel courses={query.data?.not_enrolled as Course[]} />
        </div>
      </section>
    </ContentLayout>
  );
}