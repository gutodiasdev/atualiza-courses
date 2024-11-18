"use client";

import { ContentLayout } from "@/components/dashboard/content-layout";
import { Button } from "@/components/ui/button";
import { Course } from "@/lib/@types";
import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { MoveLeft, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Page() {
  const { user } = useUser();
  const params = useParams();

  const query = useQuery<Course, AxiosError>({
    queryKey: ["courses_lessons", { user: user?.id, course: params.id }],
    queryFn: async () => {
      const { data } = await api.get(`/student/courses/${params.id}/modules/${params.module_id}/lessons`, { authorization: true });
      return data;
    },
    staleTime: 1000 * 60 * 5
  });

  if (query.isLoading) {
    return (
      <ContentLayout>
        <p>Loading...</p>
      </ContentLayout>
    );
  }

  if (query.isError) {
    return (
      <ContentLayout>
        <p>is Error!</p>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      <Link href={`/dashboard/aulas/curso/${params.id}`}>
        <Button variant="outline" className="rounded-full mb-8" size="icon">
          <MoveLeft />
        </Button>
      </Link>
      <section className="grid grid-cols-1 gap-4 px-8">
        {
          query.data?.course_modules[0].course_module_lessons.map((lesson) => (
            <div key={lesson.id} className="flex w-full items-center">
              <div className="relative w-[320px] h-[240px]">
                <Image src={lesson.video_thumb || "https://i.ibb.co/2Y4zhHq/lesson-capa.png"} alt={lesson.name} fill objectFit="cover" />
              </div>
              <div className="grow p-4 h-full">
                <h2 className="text-lg">
                  {lesson.name}
                </h2>
                <p>{lesson.description}</p>
              </div>
              <div>
                <Link href={`/dashboard/aulas/curso/${params.id}/modulo/${lesson.course_module_id}/licoes/${lesson.id}`}>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <PlayCircle className="w-6 h-6" />
                  </Button>
                </Link>
              </div>
            </div>
          ))
        }
      </section>
    </ContentLayout>
  );
}