
interface ContentLayoutProps {
  children: React.ReactNode;
}

export function ContentLayout({ children }: ContentLayoutProps) {
  return (
    <main>
      <div className="w-full py-8 px-4 sm:px-8 dark:bg-gray-950 h-screen">
        {children}
      </div>
    </main>
  );
}