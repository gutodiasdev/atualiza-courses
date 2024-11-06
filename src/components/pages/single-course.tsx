"use client";

import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";
import { AxiosError } from "axios";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

type Props = {
  courseId: string;
};

type Lesson = {
  course_module_id: number;
  description: string;
  lesson_id: number;
  name: string;
  video_thumb: string;
  video_url: string;
};

type Module = {
  course_id: number;
  course_module_id: number;
  description: string;
  image: string | null;
  name: string;
  lessons: Lesson[];
};

export default function SingleCourse(props: Props) {
  const { user } = useUser();

  const query = useQuery<Module, AxiosError>({
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
        <div className="border border-gray-700 rounded-lg h-80">

        </div>
        <div className="p-6">
          <h2 className="text-lg font-medium">
            {query.data?.name}
          </h2>
          <Accordion type="single" collapsible>
            {
              query.data?.lessons.map((lesson) => (
                <AccordionItem value={String(lesson.lesson_id)} key={lesson.lesson_id}>
                  <AccordionTrigger>{lesson.name}</AccordionTrigger>
                  <AccordionContent>
                    {lesson.description}
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