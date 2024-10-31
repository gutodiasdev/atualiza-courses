"use client";

import { ContentLayout } from "@/components/dashboard/content-layout";
import { useUser } from "@/lib/auth";

export default function Page() {
  const { user } = useUser();

  return (
    <ContentLayout title="Alunos">
      {JSON.stringify(user)}
    </ContentLayout>
  )
}