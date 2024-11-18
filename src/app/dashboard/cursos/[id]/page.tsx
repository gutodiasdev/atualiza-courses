import { ContentLayout } from "@/components/dashboard/content-layout";
import { AddModuleForm } from "@/components/dashboard/courses/forms/add-module";
import { ModulesTable } from "@/components/dashboard/courses/modules/modules-table";

export default async function Page(props: { params: Promise<{ id: string; }>; }) {
  const params = await props.params;

  return (
    <ContentLayout>
      <div className="space-y-4">
        <AddModuleForm courseId={params.id} />
        <ModulesTable courseId={params.id} />
      </div>
    </ContentLayout>
  );
}