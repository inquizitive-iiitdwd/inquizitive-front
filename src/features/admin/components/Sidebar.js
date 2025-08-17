import React from 'react';
import { Link } from "react-router-dom";
import { FiGrid, FiList, FiLogOut, FiUsers, FiPause } from 'react-icons/fi';

const Sidebar = ({ activeView, setActiveView, handleLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
    { id: 'quizzes', label: 'Quiz Management', icon: FiList },
    { id: 'members', label: 'Member Management', icon: FiUsers },
    { id: 'events', label: 'Event Management', icon: FiPause },
  ];

  return (
    <aside className="w-64 bg-slate-900/80 p-6 flex flex-col h-screen text-white border-r border-slate-700/50 flex-shrink-0">
      <div className="flex items-center gap-3 mb-10">
        <img src="/images/Club_logo.JPG.png" alt="Logo" className="w-12 h-12 rounded-full" href="" />
        <Link to="/" className="flex items-center space-x-4"></Link>
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.id} className="mb-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView(item.id);
                }}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors w-full text-left ${
                  activeView === item.id ? 'bg-yellow-400 text-black font-semibold' : 'hover:bg-slate-700/50'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 w-full text-left"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;