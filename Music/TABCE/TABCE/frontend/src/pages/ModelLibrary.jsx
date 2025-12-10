import React, { useState } from 'react';
import { Search, SlidersHorizontal, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ModelLibrary.css';

const models = [
    {
        id: 1,
        name: 'Aisha',
        ethnicity: 'South Asian',
        age: '20s',
        style: 'Natural',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop'
    },
    {
        id: 2,
        name: 'Sarah',
        ethnicity: 'Caucasian',
        age: '30s',
        style: 'Glam',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop'
    },
    {
        id: 3,
        name: 'Wei',
        ethnicity: 'East Asian',
        age: '20s',
        style: 'K-Beauty',
        image: 'https://images.unsplash.com/photo-1506795660198-e95c77602129?w=400&h=500&fit=crop'
    },
    {
        id: 4,
        name: 'Zahra',
        ethnicity: 'Middle Eastern',
        age: '20s',
        style: 'Modest',
        image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=500&fit=crop'
    },
    {
        id: 5,
        name: 'Elena',
        ethnicity: 'Hispanic',
        age: '20s',
        style: 'Bold',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop'
    },
    {
        id: 6,
        name: 'Nia',
        ethnicity: 'Black',
        age: '30s',
        style: 'Radiant',
        image: 'https://images.unsplash.com/photo-1531123418162-18fb630f943d?w=400&h=500&fit=crop'
    },
    {
        id: 7,
        name: 'Priya',
        ethnicity: 'South Asian',
        age: '40s',
        style: 'Elegant',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop'
    },
    {
        id: 8,
        name: 'Emma',
        ethnicity: 'Caucasian',
        age: '50s',
        style: 'Mature',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop'
    },
];

const ModelLibrary = () => {
    const [selectedModel, setSelectedModel] = useState(null);
    const navigate = useNavigate();

    const handleSelectModel = (model) => {
        setSelectedModel(model.id);
        setTimeout(() => {
            navigate('/create');
        }, 600);
    };

    return (
        <div className="library-container">
            <div className="library-header">
                <div>
                    <h1 className="page-title">Model Library</h1>
                    <p className="page-subtitle">Diverse AI-generated models representing all customers.</p>
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
                    <div
                        key={model.id}
                        className={`model-card-large glass-panel ${selectedModel === model.id ? 'selected' : ''}`}
                        onClick={() => handleSelectModel(model)}
                    >
                        <div className="model-image-wrapper">
                            <img
                                src={model.image}
                                alt={model.name}
                            />
                            <div className="model-overlay">
                                <button className="btn btn-primary btn-sm">
                                    {selectedModel === model.id ? (
                                        <>
                                            <CheckCircle size={16} />
                                            Selected
                                        </>
                                    ) : (
                                        'Select Model'
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="model-info">
                            <h3>{model.name}</h3>
                            <div className="tags">
                                <span className="tag">{model.ethnicity}</span>
                                <span className="tag">{model.age}</span>
                                <span className="tag">{model.style}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ModelLibrary;
