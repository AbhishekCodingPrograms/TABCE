import React, { useState } from 'react';
import {
    Image as ImageIcon,
    Upload,
    MoreVertical,
    Trash2,
    Download,
    Filter
} from 'lucide-react';
import './AssetGallery.css';

const initialAssets = [
    { id: 1, name: 'Summer Lipstick.png', type: 'Product', date: '2023-10-24', size: '1.2 MB', url: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 2, name: 'Generated_Campaign_01.jpg', type: 'Creative', date: '2023-10-23', size: '450 KB', url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 3, name: 'Foundation_Bottle.png', type: 'Product', date: '2023-10-22', size: '2.1 MB', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 4, name: 'Social_Post_Variant_A.jpg', type: 'Creative', date: '2023-10-21', size: '380 KB', url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 5, name: 'Eyeliner_Black.png', type: 'Product', date: '2023-10-20', size: '0.8 MB', url: 'https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 6, name: 'Banner_Wide.jpg', type: 'Creative', date: '2023-10-19', size: '420 KB', url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
];

const AssetGallery = () => {
    const [filter, setFilter] = useState('All');
    const [assets, setAssets] = useState(initialAssets);

    const filteredAssets = filter === 'All'
        ? assets
        : assets.filter(asset => asset.type === filter);

    return (
        <div className="gallery-container">
            <div className="gallery-header">
                <div>
                    <h1 className="page-title">Asset Gallery</h1>
                    <p className="page-subtitle">Manage your product images and generated creatives.</p>
                </div>
                <button className="btn btn-primary">
                    <Upload size={20} /> Upload New
                </button>
            </div>

            <div className="gallery-controls">
                <div className="filter-tabs">
                    {['All', 'Product', 'Creative'].map(type => (
                        <button
                            key={type}
                            className={`filter-tab ${filter === type ? 'active' : ''}`}
                            onClick={() => setFilter(type)}
                        >
                            {type}
                        </button>
                    ))}
                </div>
                <div className="view-options">
                    <button className="btn btn-secondary btn-sm">
                        <Filter size={16} /> Filter
                    </button>
                </div>
            </div>

            <div className="assets-grid">
                {filteredAssets.map(asset => (
                    <div key={asset.id} className="asset-card glass-panel">
                        <div className="asset-preview">
                            <img src={asset.url} alt={asset.name} />
                            <div className="asset-overlay">
                                <button className="action-btn" title="Download">
                                    <Download size={18} />
                                </button>
                                <button className="action-btn delete" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <span className="asset-type-badge">{asset.type}</span>
                        </div>
                        <div className="asset-info">
                            <div className="asset-details">
                                <h4 className="asset-name">{asset.name}</h4>
                                <p className="asset-meta">{asset.size} • {asset.date}</p>
                            </div>
                            <button className="more-btn">
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssetGallery;
