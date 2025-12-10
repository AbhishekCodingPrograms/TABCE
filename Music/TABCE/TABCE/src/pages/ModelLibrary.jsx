import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import './ModelLibrary.css';

const models = [
    { id: 1, name: 'Aisha', ethnicity: 'South Asian', age: '20s', style: 'Natural' },
    { id: 2, name: 'Sarah', ethnicity: 'Caucasian', age: '30s', style: 'Glam' },
    { id: 3, name: 'Wei', ethnicity: 'East Asian', age: '20s', style: 'K-Beauty' },
    { id: 4, name: 'Zahra', ethnicity: 'Middle Eastern', age: '20s', style: 'Modest' },
    { id: 5, name: 'Elena', ethnicity: 'Hispanic', age: '20s', style: 'Bold' },
    { id: 6, name: 'Nia', ethnicity: 'Black', age: '30s', style: 'Radiant' },
    { id: 7, name: 'Priya', ethnicity: 'South Asian', age: '40s', style: 'Elegant' },
    { id: 8, name: 'Emma', ethnicity: 'Caucasian', age: '50s', style: 'Mature' },
];

const ModelLibrary = () => {
    const [filter, setFilter] = useState('All');

    return (
        <div className="library-container">
            <div className="library-header">
                <div>
                    <h1 className="page-title">Model Library</h1>
                    <p className="page-subtitle">Diverse AI-generated models for every campaign.</p>
                </div>
                <div className="search-bar">
                    <Search size={20} className="search-icon" />
                    <input type="text" placeholder="Search models..." />
                </div>
            </div>

            <div className="filters-bar">
                <button className="filter-btn active">All Models</button>
                <button className="filter-btn">South Asian</button>
                <button className="filter-btn">East Asian</button>
                <button className="filter-btn">Black</button>
                <button className="filter-btn">Caucasian</button>
                <button className="filter-btn">Middle Eastern</button>
                <div className="filter-separator" />
                <button className="btn btn-secondary btn-sm">
                    <SlidersHorizontal size={16} /> More Filters
                </button>
            </div>

            <div className="models-grid-large">
                {models.map((model) => (
                    <div key={model.id} className="model-card-large glass-panel">
                        <div className="model-image-wrapper">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${model.id}`}
                                alt={model.name}
                            />
                            <div className="model-overlay">
                                <button className="btn btn-primary btn-sm">Select Model</button>
                            </div>
                        </div>
                        <div className="model-info">
                            <h3>{model.name}</h3>
                            <div className="tags">
                                <span className="tag">{model.ethnicity}</span>
                                <span className="tag">{model.age}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ModelLibrary;
