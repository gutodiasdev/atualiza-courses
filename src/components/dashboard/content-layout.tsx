
interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <main>
      <div className="w-full pt-8 pb-8 px-4 sm:px-8 dark:bg-gray-950 h-screen">
        <h1 className="text-lg font-semibold tracking-wide">
          {title}
        </h1>
        {children}
      </div>
    </main>
  );
}