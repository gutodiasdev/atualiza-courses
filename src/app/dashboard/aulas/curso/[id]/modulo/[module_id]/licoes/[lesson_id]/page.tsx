"use client";

import { Button } from "@/components/ui/button";
import { Course } from "@/lib/@types";
import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactPlayer from "react-player/lazy";

export default function Page() {
  const params = useParams() as { id: string, module_id: string, lesson_id: string; };
  const { user } = useUser();
  const query = useQuery<Course, AxiosError>({
    queryKey: ["lesson_video", user?.id, params.lesson_id],
    queryFn: async () => {
      const { data } = await api.get(`/student/courses/${params.id}/modules/${params.module_id}/lessons/${params.lesson_id}`, { authorization: true });
      return data;
    },
    staleTime: 1000 * 60 * 5
  });

  if (query.isLoading) {
    return (
      <p>is loading...</p>
    );
  }

  return (
    <div className="absolute top-0 left-0 w-screen h-screen z-40 bg-black">
      <Link href={`/dashboard/aulas/curso/${params.id}/modulo/${params.module_id}/licoes`}>
        <Button variant="outline" className="rounded-full absolute z-50 top-8 left-8" size="icon">
          <MoveLeft />
        </Button>
      </Link>
      <ReactPlayer
        url={query.data?.course_modules[0].course_module_lessons[0].video_url}
        playsinline
        width="100%"
        height="100%"
        controls
        playing
      />
    </div>
  );
}