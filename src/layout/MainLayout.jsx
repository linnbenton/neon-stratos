import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function MainLayout({ children, search, setSearch }) {
  return (
    <div className="min-h-screen bg-[#05060a] text-slate-200">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Right side */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Topbar */}
          <Topbar search={search} setSearch={setSearch} />

          {/* Content */}
          <main
            className="
              flex-1
              overflow-x-hidden
              overflow-y-auto
              p-4 md:p-6
            "
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
