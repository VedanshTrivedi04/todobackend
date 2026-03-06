import { Search, Bell, Moon } from "lucide-react";

export default function Navbar({ toggleTheme }) {

  return (

    <header className="h-16 px-6 border-b bg-white flex items-center justify-between">

      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg w-64">

        <Search size={16}/>
        <input
          placeholder="Search tasks..."
          className="bg-transparent outline-none text-sm w-full"
        />

      </div>

      <div className="flex items-center gap-4">

        <button onClick={toggleTheme}>
          <Moon size={18}/>
        </button>

        <Bell size={18}/>

        <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center">
          JD
        </div>

      </div>

    </header>
  );
}