
import { ContentLayout } from "@/components/dashboard/content-layout";

export default async function Page(props: { params: Promise<{ id: string; }>; }) {
  const params = await props.params;

  return (
    <ContentLayout>
      <p>Licões Works!</p>
    </ContentLayout>
  );
}