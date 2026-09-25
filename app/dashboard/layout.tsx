import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">

        {/* Desktop sidebar */}
        <Sidebar />

        <div className="min-w-0 flex-1">

          {/* Header */}
          <Header />

          {/* Dashboard content */}
          <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
            <div className="mx-auto w-full max-w-7xl">
              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}