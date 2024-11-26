"use client";

import { ContentLayout } from "@/components/dashboard/content-layout";
import { Mentor } from "@/lib/@types";
import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const { user } = useUser();
  const query = useQuery<Mentor[], AxiosError>({
    queryKey: ["mentors", { user: user?.id }],
    queryFn: async () => {
      const { data } = await api.get("/mentors/findAll", { authorization: true });
      return data;
    },
    staleTime: 1000 * 60 * 5
  });

  if (query.isLoading) {
    return (
      <section className="w-full h-[100dvh] grid place-content-center">
        <Loader className="w-6 h-6 animate-spin" />
      </section>
    );
  }

  return (
    <ContentLayout>
      <section className="w-full">
        <h2 className="uppercase font-semibold text-lg">
          Mentores
        </h2>
        <div className="grid 2xl:grid-cols-10">
          {
            query.data?.map((mentor) => (
              <Link key={mentor.id} href={`/dashboard/mentores/${mentor.id}`}>
                <div className="mt-4 text-center space-y-2 flex flex-col items-center">
                  <div className="relative w-36 h-36 bg-gradient-to-tr from-yellow-400 to-purple-600 rounded-full">
                    <Image src={mentor.avatar} alt="preview" fill objectFit="cover" className="rounded-full p-1" />
                  </div>
                  <h2 className="font-medium text-lg">
                    {mentor.name}
                  </h2>
                </div>
              </Link>
            ))
          }
        </div>
      </section>
    </ContentLayout>
  );
}