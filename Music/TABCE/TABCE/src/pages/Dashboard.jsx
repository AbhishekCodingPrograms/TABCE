import React from 'react';
import {
    TrendingUp,
    Image as ImageIcon,
    Users,
    ArrowRight,
    Plus,
    Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="stat-card glass-panel">
        <div className="stat-header">
            <div className={`stat-icon-bg ${color}`}>
                <Icon size={20} className="stat-icon" />
            </div>
            <span className={`stat-change ${change >= 0 ? 'positive' : 'negative'}`}>
                {change > 0 ? '+' : ''}{change}%
            </span>
        </div>
        <div className="stat-content">
            <h3 className="stat-value">{value}</h3>
            <p className="stat-title">{title}</p>
        </div>
    </div>
);

const ProjectCard = ({ title, date, image, status }) => (
    <Link to="/create" className="project-card glass-panel">
        <div className="project-image-container">
            <img src={image} alt={title} className="project-image" />
            <div className="project-overlay">
                <button className="btn btn-primary btn-sm">Edit Campaign</button>
            </div>
            <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
        </div>
        <div className="project-info">
            <h4 className="project-title">{title}</h4>
            <div className="project-meta">
                <Clock size={14} />
                <span>{date}</span>
                <span className="project-arrow"><ArrowRight size={14} /></span>
            </div>
        </div>
    </Link>
);

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Welcome back, Sarah. Here's what's happening today.</p>
                </div>
                <Link to="/create" className="btn btn-primary">
                    <Plus size={20} />
                    New Campaign
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <StatCard
                    title="Active Campaigns"
                    value="12"
                    change={8}
                    icon={TrendingUp}
                    color="blue"
                />
                <StatCard
                    title="Generated Creatives"
                    value="1,248"
                    change={24}
                    icon={ImageIcon}
                    color="purple"
                />
                <StatCard
                    title="Avg. CTR Prediction"
                    value="4.8%"
                    change={1.2}
                    icon={Users}
                    color="green"
                />
            </div>

            {/* Recent Projects */}
            <div className="section-header">
                <h2 className="section-title">Recent Projects</h2>
                <Link to="/gallery" className="view-all-link">
                    View All <ArrowRight size={16} />
                </Link>
            </div>

            <div className="projects-grid">
                <ProjectCard
                    title="Summer Glow Campaign"
                    date="2 hours ago"
                    image="https://images.unsplash.com/photo-1596462502278-27bfdd403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    status="Processing"
                />
                <ProjectCard
                    title="L'Oreal Matte Lipstick"
                    date="Yesterday"
                    image="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    status="Completed"
                />
                <ProjectCard
                    title="Maybelline Mascara"
                    date="2 days ago"
                    image="https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    status="Draft"
                />
                <ProjectCard
                    title="Skincare Essentials"
                    date="3 days ago"
                    image="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    status="Completed"
                />
            </div>
        </div>
    );
};

export default Dashboard;
