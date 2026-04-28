import { Users } from "lucide-react";

const SidebarSkeleton = () => (
  <aside className="h-full w-20 lg:w-72 border-r border-gray-100 flex flex-col bg-white">
    <div className="border-b border-gray-100 p-4 flex items-center gap-2">
      <Users className="size-5 text-gray-400" />
      <span className="font-semibold text-sm hidden lg:block text-gray-400">Contacts</span>
    </div>
    <div className="overflow-y-auto flex-1 py-2">
      {Array(7).fill(null).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <div className="skeleton size-10 rounded-full flex-shrink-0 mx-auto lg:mx-0" />
          <div className="hidden lg:flex flex-col gap-1.5 flex-1">
            <div className="skeleton h-3.5 w-28 rounded" />
            <div className="skeleton h-2.5 w-16 rounded" />
          </div>
        </div>
      ))}
    </div>
  </aside>
);

export default SidebarSkeleton;