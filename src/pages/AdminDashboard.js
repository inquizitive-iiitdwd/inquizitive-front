import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from '../features/admin/components/Sidebar.js';
import QuizManager from '../features/admin/views/QuizManager.js';

const DashboardHome = () => (
    <div className="p-8">
        <h1 className="text-3xl font-bold text-white">Welcome, Admin!</h1>
        <p className="text-gray-400 mt-2">Select a category from the sidebar to manage your club's activities.</p>
    </div>
);

const AdminDashboard = () => {
    const [activeView, setActiveView] = useState('quizzes');

    const renderView = () => {
        switch(activeView) {
            case 'quizzes': 
                return <QuizManager />;
            // Add other cases for 'team', 'settings' etc. as you build them
            // case 'team': return <TeamManager />;
            case 'dashboard':
            default:
                return <DashboardHome />;
        }
    };

    return (
        <div className="bg-gradient-to-br from-[#2e1a47] to-[#1a0e2e] min-h-screen text-white flex">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1 overflow-auto">{renderView()}</main>
            <Toaster position="bottom-right" />
        </div>
    );
};

export default AdminDashboard;