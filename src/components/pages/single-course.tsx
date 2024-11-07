"use client";

import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";
import { AxiosError } from "axios";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import Image from "next/image";

type Props = {
  courseId: string;
};

type Course = {
  id: number;
  name: string;
  description: string;
  image: string | null;
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
      <section className="flex item-center justify-end gap-x-4">
        <Button variant="outline" >
          <CheckCircle />
          Solicitar aprovação
        </Button>
      </section>
      <section className="space-y-4">
        <div className="border border-gray-700 rounded-lg h-80 flex gap-x-8">
          <div className="relative w-80 h-80">
            <Image src={query.data?.image as string} alt={query.data?.name as string} fill />
          </div>
          <div className="p-16 space-y-4">
            <h2 className="text-2xl font-medium">
              {query.data?.name}
            </h2>
            <p>
              {query.data?.description}
            </p>
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