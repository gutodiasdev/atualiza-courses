"use client";

import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import Image from "next/image";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";

type Props = {
  courseId: string;
};

type Course = {
  id: number;
  name: string;
  description: string;
  image: string | null;
  background_image: string | null;
  teacher_id: number;
  created_at: string;
  updated_at: string;
  course_modules: Module[];
};

type Module = {
  id: number;
  course_id: number;
  name: string;
  description: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  course_module_lessons: Lesson[];
};

type Lesson = {
  id: number;
  course_module_id: number;
  name: string;
  description: string;
  video_url: string;
  video_thumb: string;
  created_at: string;
  updated_at: string;
};

export default function SingleCourse(props: Props) {
  const { user } = useUser();

  const query = useQuery<Course, AxiosError>({
    queryKey: ["course", props.courseId, user?.id],
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
    <div className="space-y-4 -m-[32px]">
      <section className="space-y-4">
        <div className="relative rounded-lg h-full flex gap-x-8 backdrop-blur-3xl">
          <div className="absolute w-full grid grid-cols-2 z-10">
            <div className="text-white h-[600px] flex flex-col justify-center p-10 space-y-4">
              <h2 className="text-5xl font-semibold">
                {query.data?.name}
              </h2>
              <p>
                {query.data?.description}
              </p>
              <section className="pt-8">
                <Button variant="outline" size="lg">
                  <CheckCircle />
                  Solicitar aprovação
                </Button>
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
          <Accordion type="single" collapsible>
            {
              query.data?.course_modules.map((module) => (
                <AccordionItem value={String(module.id)} key={module.id}>
                  <AccordionTrigger>{module.name}</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    {module.description}
                    <h3 className="mt-8 text-sm">
                      Lições
                    </h3>
                    <ul className="px-8 list-disc">
                      {
                        module.course_module_lessons.map((lesson) => (
                          <li key={lesson.id} className="list-item">
                            {lesson.name}
                          </li>
                        ))
                      }
                    </ul>
                    {/* <Accordion  type="single" collapsible className="px-8">
                      {
                        module.course_module_lessons.map((module) => (
                          <AccordionItem value={String(module.id)} key={module.id}>
                            <AccordionTrigger>{module.name}</AccordionTrigger>
                            <AccordionContent>
                              {module.description}
                            </AccordionContent>
                          </AccordionItem>
                        ))
                      }
                    </Accordion> */}
                  </AccordionContent>
                </AccordionItem>
              ))
            }
          </Accordion>
        </div>
      </section>
    </div>
  );
}