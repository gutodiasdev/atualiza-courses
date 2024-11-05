import { ContentLayout } from "@/components/dashboard/content-layout";
import { AddLessonForm } from "@/components/dashboard/courses/forms/add-lesson";
import { LessonsTable } from "@/components/dashboard/courses/modules/lessons/lessons-table";

export default async function Page(props: { params: Promise<{ id: string; module_id: string; }>; }) {
  const params = await props.params;

  return (
    <ContentLayout title="Lição">
      <div className="space-y-4">
        <AddLessonForm courseId={params.id} moduleId={params.module_id}/>
        <LessonsTable courseId={params.id} moduleId={params.module_id}/>
      </div>
    </ContentLayout>
  );
}