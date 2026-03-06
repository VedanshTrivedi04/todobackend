import { LayoutDashboard, CheckCircle2, History, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import SidebarItem from "../components/SidebarItem";

export default function Sidebar({ activeTasks, logout }) {

  const navigate = useNavigate();
  const location = useLocation();

  return (

    <aside className="w-64 bg-white border-r flex flex-col">

      <div className="p-6 font-bold text-xl">
        TaskFlow
      </div>

      <nav className="flex-1 px-4 space-y-2">

        <SidebarItem
          icon={<LayoutDashboard size={18}/>}
          label="Dashboard"
          isActive={location.pathname === "/"}
          onClick={()=>navigate("/")}
          badge={activeTasks}
        />

        <SidebarItem
          icon={<CheckCircle2 size={18}/>}
          label="Completed"
          isActive={location.pathname === "/completed"}
          onClick={()=>navigate("/completed")}
        />

        <SidebarItem
          icon={<History size={18}/>}
          label="History"
          isActive={location.pathname === "/history"}
          onClick={()=>navigate("/history")}
        />

      </nav>

      <div className="p-4 border-t">

        <button
          onClick={logout}
          className="flex items-center gap-3 text-red-500"
        >
          <LogOut size={18}/>
          Logout
        </button>

      </div>

    </aside>
  );
}