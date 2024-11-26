"use client";

import { ContentLayout } from "@/components/dashboard/content-layout";
import { CoursesCarousel } from "@/components/dashboard/courses-carousel";
import { Course } from "@/lib/@types";
import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Mentor = {
  id: number;
  avatar: string;
  name: string;
};

export default function Page() {
  const { user } = useUser();
  const query = useQuery<Mentor[], AxiosError>({
    queryKey: ["mentors", { id: user?.id }],
    queryFn: async () => {
      const { data } = await api.get("/mentors/getAll", { authorization: true });
      return data;
    },
    staleTime: 1000 * 10
  });
  const recentlyLaunchedCourses = useQuery<Course[], AxiosError>({
    queryKey: ["recently_launched_courses", { id: user?.id }],
    queryFn: async () => {
      const { data } = await api.get("/dashboard/recent_courses", { authorization: true });
      return data;
    },
    staleTime: 1000 * 10
  });

  if (query.isLoading || recentlyLaunchedCourses.isLoading) {
    return (
      <section className="w-full h-[100dvh] grid place-content-center">
        <Loader className="w-6 h-6 animate-spin" />
      </section>
    );
  }

  return (
    <ContentLayout>
      <section className="space-y-4 mb-8">
        <h2 className="uppercase font-semibold text-lg">
          Mentores
        </h2>
        <div className="grid 2xl:grid-cols-12">
          {
            query.data?.map((mentor) => (
              <Link key={mentor.id} href={`/dashboard/mentores/${mentor.id}`}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-gray-800">
                    <Image src={mentor.avatar} alt="preview" fill objectFit="contain" />
                  </div>
                  <h3>
                    {mentor.name}
                  </h3>
                </div>
              </Link>
            ))
          }
        </div>
      </section>
      <section>
        <h2 className="uppercase font-semibold text-lg">
          Lançamentos
        </h2>
        <div className="flex w-full">
          <CoursesCarousel courses={recentlyLaunchedCourses.data as Course[]} />
        </div>
      </section>
    </ContentLayout>
  );
}