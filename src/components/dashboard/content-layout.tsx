import { Navbar } from "@/components/dashboard/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className="container pt-8 pb-8 px-4 sm:px-8 dark:bg-gray-950 h-[calc(100dvh-64px)]">
        {children}
      </div>
    </div>
  );
}