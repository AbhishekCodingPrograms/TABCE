import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Wand2,
    Users,
    Image as ImageIcon,
    Settings,
    LogOut,
    Bell,
    Menu,
    X
} from 'lucide-react';
import './MainLayout.css';

const SidebarItem = ({ icon: Icon, label, to, onClick }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
        onClick={onClick}
    >
        <Icon size={20} className="sidebar-icon" />
        <span className="sidebar-label">{label}</span>
    </NavLink>
);

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="app-container">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={closeSidebar} />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-container">
                        <span className="logo-text">T</span>
                    </div>
                    <h1 className="app-title">TABCE</h1>
                    <button className="close-sidebar-btn" onClick={closeSidebar}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" onClick={closeSidebar} />
                    <SidebarItem icon={Wand2} label="Creative Studio" to="/create" onClick={closeSidebar} />
                    <SidebarItem icon={Users} label="Model Library" to="/models" onClick={closeSidebar} />
                    <SidebarItem icon={ImageIcon} label="Asset Gallery" to="/gallery" onClick={closeSidebar} />
                </nav>

                <div className="sidebar-footer">
                    <SidebarItem icon={Settings} label="Settings" to="/settings" />
                    <button className="logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Header */}
                <header className="top-header">
                    <div className="header-left">
                        <button className="menu-toggle-btn" onClick={toggleSidebar}>
                            <Menu size={24} />
                        </button>
                        <h2 className="header-subtitle">Tesco AI Beauty Try-On Creative Engine</h2>
                    </div>

                    <div className="header-right">
                        <button className="notification-btn">
                            <Bell size={20} />
                            <span className="notification-badge"></span>
                        </button>
                        <div className="user-profile">
                            <div className="user-info">
                                <p className="user-name">Sarah Jenkins</p>
                                <p className="user-role">L'Oréal Paris</p>
                            </div>
                            <div className="user-avatar">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="User" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="content-area">
                    <div className="content-background" />
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
