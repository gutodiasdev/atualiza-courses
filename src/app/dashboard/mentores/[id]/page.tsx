"use client";

import { ContentLayout } from "@/components/dashboard/content-layout";
import { CoursesCarousel } from "@/components/dashboard/courses-carousel";
import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams() as { id: string; };
  const { user } = useUser();
  const mentor = useQuery({
    queryKey: ["mentor", { user: user?.id, mentor: id }],
    queryFn: async () => {
      const { data } = await api.get("/mentors/findById", {
        authorization: true,
        params: {
          mentorId: id
        }
      });
      return data;
    },
    staleTime: 1000 * 60 * 5
  });

  if (mentor.isLoading) {
    return (
      <section className="w-full h-[100dvh] grid place-content-center">
        <Loader className="w-6 h-6 animate-spin" />
      </section>
    );
  }

  return (
    <ContentLayout>
      <div className="space-y-6">
        <section className="w-full flex mb-8">
          <div className="mt-4">
            <div className="relative w-36 h-36 bg-gradient-to-tr from-yellow-400 to-purple-600 rounded-full">
              <Image src={mentor.data.mentor[0].avatar} alt="preview" fill objectFit="cover" className="rounded-full p-1" />
            </div>
          </div>
          <div className="py-4 px-8 flex-grow">
            <h2 className="font-medium text-lg">
              {mentor.data.mentor[0].name}
            </h2>
            <p>
              {mentor.data.mentor[0].bio}
            </p>
          </div>
        </section>
        <section>
          <h2 className="uppercase font-semibold text-lg">
            Novidades
          </h2>
          <CoursesCarousel courses={mentor.data.recentLaunchs} />
        </section>
        <section>
          <h2 className="uppercase font-semibold text-lg">
            Cursos
          </h2>
          <CoursesCarousel courses={mentor.data.otherCourses} />
        </section>
      </div>

    </ContentLayout>
  );
}