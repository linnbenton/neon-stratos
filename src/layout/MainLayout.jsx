import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function MainLayout({ children, search, setSearch }) {
  return (
    <div className="min-h-screen bg-[#05060a] text-slate-200">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN COLUMN */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* TOPBAR */}
          <Topbar search={search} setSearch={setSearch} />

          {/* CONTENT AREA */}
          <main
            className="
              flex-1

              overflow-x-hidden
              overflow-y-auto

              px-4
              py-4

              md:px-6
              md:py-6

              space-y-6
            "
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
