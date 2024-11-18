import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

type Props = {
  courseId: string;
};

export function AddModuleForm(props: Props) {

  return (
    <section>
      <section className="flex item-center justify-between gap-x-4 py-4">
        <Link href="/dashboard/cursos">
          <Button type="button" size="icon" variant="outline">
            <ArrowLeft />
          </Button>
        </Link>
        <Link href={`/dashboard/cursos/${props.courseId}/adicionar-modulo`}>
          <Button type="button" variant="outline">
            <Plus />
            Adicionar módulo
          </Button>
        </Link>
      </section>
    </section>
  );
}