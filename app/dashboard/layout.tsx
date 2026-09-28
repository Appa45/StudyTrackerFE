import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-slate-50">
      <div className="flex h-full">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Dashboard */}
        <div className="relative flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <Header />

          {/* Scrollable Dashboard Content */}
          <main className="min-h-0 flex-1 overflow-y-auto pb-20">
            <div className="px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
              <div className="mx-auto w-full max-w-7xl">
                {children}
              </div>
            </div>
          </main>

          {/* Fixed Footer */}
          <div className="absolute bottom-0 left-0 right-0 z-40">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}