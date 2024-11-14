
import { ContentLayout } from "@/components/dashboard/content-layout";
import SingleCourse from "@/components/pages/single-course";

export default async function Page(props: { params: Promise<{ id: string; }>; }) {
  const params = await props.params;

  return (
    <ContentLayout>
      <SingleCourse courseId={params.id} />
    </ContentLayout>
  );
}