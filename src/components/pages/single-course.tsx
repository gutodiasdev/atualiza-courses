"use client";

import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";
import { Button } from "../ui/button";
import { CheckCircle, Clock, MoveLeft } from "lucide-react";
import { Course, Module } from "@/lib/@types";
import { ModulesCarousel } from "../dashboard/modules-carousel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
  courseId: string;
};

export default function SingleCourse(props: Props) {
  const { user } = useUser();
  const client = useQueryClient();
  const router = useRouter();
  const query = useQuery<Course, AxiosError>({
    queryKey: ["course", props.courseId, user?.id],
    queryFn: async () => {
      const { data } = await api.get("/student/courses/" + props.courseId, { authorization: true });
      return data;
    }
  });

  const mutation = useMutation({
    mutationKey: ["request_course_approval", { user: user?.id, course_id: props.courseId }],
    mutationFn: async ({ teacherId }: { teacherId: number; }) => {
      const { data } = await api.post(`/student/course/${props.courseId}/request_approval`, {
        userId: user?.id,
        teacherId: teacherId
      }, {
        authorization: true
      });
      return data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["student_courses", user?.id] });
      router.push("/dashboard/aulas");
    }
  });

  const requestCourseApproval = async (value: number) => {
    await mutation.mutateAsync({ teacherId: value });
  };

  if (query.isLoading) {
    return (
      <p>is loading...</p>
    );
  }

  return (
    <div className="space-y-4 -m-[32px]">
      <section className="space-y-4">
        <div className="relative rounded-lg h-full flex gap-x-8 backdrop-blur-3xl">
          <div className="absolute w-full grid grid-cols-2 z-10">
            <div className="text-white h-[600px] flex flex-col justify-center p-10 space-y-4">
              <Link href={`/dashboard/aulas`}>
                <Button variant="outline" className="rounded-full mb-8" size="icon">
                  <MoveLeft />
                </Button>
              </Link>
              <h2 className="text-5xl font-semibold">
                {query.data?.name}
              </h2>
              <p>
                {query.data?.description}
              </p>
              <section className={cn("pt-8", (query.data?.requestStatus?.status === "approved") ? "hidden" : null)}>
                {
                  (query.data?.requestStatus?.status === "pending") ? (

                    <Button variant="outline" size="lg" disabled>
                      <Clock />
                      Aguarde aprovação
                    </Button>
                  ) : (
                    <Button variant="outline" size="lg" onClick={() => requestCourseApproval(query.data?.teacher_id as number)}>
                      <CheckCircle />
                      Solicitar aprovação
                    </Button>
                  )
                }
              </section>
            </div>
            <div>

            </div>
          </div>
          <div className="relative w-full h-[600px] mx-auto overflow-hidden">
            <div className="relative w-screen h-[600px] bg-gradient-to-t from-black via-black to-transparent">
              <Image
                src={query.data?.background_image as string}
                alt={query.data?.name as string}
                fill
                layout="cover"
                className=" bg-gradient-to-t from-black via-black to-transparent"
              />
            </div>
            <div className="absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.95)] pointer-events-none"></div>
          </div>
        </div>
        <div className="p-6">
          <ModulesCarousel modules={query.data?.course_modules as Module[]} />
        </div>
      </section>
    </div>
  );
}