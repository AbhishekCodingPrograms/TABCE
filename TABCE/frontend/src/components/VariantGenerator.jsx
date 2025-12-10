import React, { useState, useEffect } from 'react';
import { Sparkles, Download, Share2, Eye, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import './VariantGenerator.css';

const VariantGenerator = ({ productData, modelData, makeupConfig }) => {
    const [variants, setVariants] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [progress, setProgress] = useState(0);

    const themes = [
        { id: 'diwali', name: 'Diwali Festive', colors: ['#FF6B35', '#F7931E', '#FFC700'], description: 'Warm, festive Indian celebration' },
        { id: 'christmas', name: 'Christmas Glam', colors: ['#C41E3A', '#0C8346', '#FFD700'], description: 'Traditional holiday elegance' },
        { id: 'ramadan', name: 'Ramadan Modest', colors: ['#2C5F2D', '#97BC62', '#E8C547'], description: 'Elegant modest beauty' },
        { id: 'summer', name: 'Summer Radiance', colors: ['#FF69B4', '#87CEEB', '#FFD700'], description: 'Bright and vibrant' },
        { id: 'minimal', name: 'Minimal Chic', colors: ['#E5E5E5', '#A0A0A0', '#FFFFFF'], description: 'Clean and modern' },
    ];

    const audienceSegments = [
        { id: 'gen-z', name: 'Gen Z (18-24)', preference: 'Bold & Trendy' },
        { id: 'millennial', name: 'Millennial (25-40)', preference: 'Natural & Professional' },
        { id: 'mature', name: 'Mature (40+)', preference: 'Elegant & Refined' },
    ];

    const layouts = [
        { id: 'square', name: 'Social Feed', format: '1080x1080', ratio: '1:1', platform: 'Instagram/FB' },
        { id: 'story', name: 'Stories', format: '1080x1920', ratio: '9:16', platform: 'Insta/FB Stories' },
        { id: 'landscape', name: 'Landscape', format: '1200x628', ratio: '1.91:1', platform: 'Facebook Feed' },
    ];

    const generateVariants = () => {
        setIsGenerating(true);
        setProgress(0);
        const newVariants = [];

        // Simulate AI generation with progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsGenerating(false);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);

        // Generate variants based on combinations
        let variantId = 1;
        themes.forEach(theme => {
            layouts.forEach(layout => {
                audienceSegments.slice(0, 1).forEach(audience => {
                    const ctrPrediction = (Math.random() * 3 + 2).toFixed(2); // 2-5% CTR
                    const visualAppeal = Math.floor(Math.random() * 20 + 80); // 80-100 score
                    const relevanceScore = Math.floor(Math.random() * 15 + 85); // 85-100 score

                    newVariants.push({
                        id: variantId++,
                        theme,
                        layout,
                        audience,
                        ctrPrediction: parseFloat(ctrPrediction),
                        visualAppeal,
                        relevanceScore,
                        overallScore: ((parseFloat(ctrPrediction) * 20 + visualAppeal + relevanceScore) / 3).toFixed(1),
                        fileSize: Math.floor(Math.random() * 150 + 350), // 350-500 KB
                        compliance: Math.random() > 0.2 ? 'passed' : 'warning',
                        complianceIssues: Math.random() > 0.2 ? [] : ['Text readability: 95%'],
                    });
                });
            });
        });

        // Sort by overall score
        newVariants.sort((a, b) => b.overallScore - a.overallScore);

        setTimeout(() => {
            setVariants(newVariants);
        }, 2000);
    };

    const exportVariant = (variant) => {
        console.log('Exporting variant:', variant);
        alert(`Exporting ${variant.theme.name} - ${variant.layout.name}\nFormat: ${variant.layout.format}\nEstimated size: ${variant.fileSize}KB`);
    };

    const exportAll = () => {
        alert(`Exporting all ${variants.length} variants as ZIP archive\nTotal estimated size: ${variants.reduce((sum, v) => sum + v.fileSize, 0)}KB`);
    };

    return (
        <div className="variant-generator">
            <div className="generator-header">
                <div>
                    <h2>🎨 Multi-Variant Creative Generator</h2>
                    <p>AI generates optimized variations for different themes, audiences & platforms</p>
                </div>
                <div className="generator-actions">
                    <button
                        className="btn btn-primary"
                        onClick={generateVariants}
                        disabled={isGenerating}
                    >
                        <Sparkles size={20} />
                        {isGenerating ? 'Generating...' : `Generate ${themes.length * 2} Variants`}
                    </button>
                    {variants.length > 0 && (
                        <button className="btn btn-secondary" onClick={exportAll}>
                            <Download size={20} />
                            Export All
                        </button>
                    )}
                </div>
            </div>

            {isGenerating && (
                <div className="generation-progress glass-panel">
                    <div className="progress-content">
                        <Sparkles className="sparkle-icon" size={48} />
                        <h3>AI is creating your variants...</h3>
                        <div className="progress-steps">
                            <div className={progress >= 20 ? 'step-active' : ''}>🎨 Applying themes</div>
                            <div className={progress >= 40 ? 'step-active' : ''}>👤 Adapting for audiences</div>
                            <div className={progress >= 60 ? 'step-active' : ''}>📐 Optimizing layouts</div>
                            <div className={progress >= 80 ? 'step-active' : ''}>🤖 Predicting performance</div>
                            <div className={progress >= 100 ? 'step-active' : ''}>✅ Finalizing variants</div>
                        </div>
                        <div className="progress-bar-container">
                            <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
                                <span className="progress-percentage">{progress}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {variants.length > 0 && !isGenerating && (
                <div className="variants-container">
                    <div className="variants-summary">
                        <div className="summary-stat">
                            <span className="stat-label">Total Variants</span>
                            <span className="stat-value">{variants.length}</span>
                        </div>
                        <div className="summary-stat">
                            <span className="stat-label">Avg CTR Prediction</span>
                            <span className="stat-value">
                                {(variants.reduce((sum, v) => sum + v.ctrPrediction, 0) / variants.length).toFixed(2)}%
                            </span>
                        </div>
                        <div className="summary-stat">
                            <span className="stat-label">Top Performer</span>
                            <span className="stat-value">{variants[0].theme.name}</span>
                        </div>
                        <div className="summary-stat">
                            <span className="stat-label">Compliance</span>
                            <span className="stat-value">
                                {variants.filter(v => v.compliance === 'passed').length}/{variants.length} ✓
                            </span>
                        </div>
                    </div>

                    <div className="variants-grid">
                        {variants.map((variant) => (
                            <div
                                key={variant.id}
                                className={`variant-card glass-panel ${selectedVariant?.id === variant.id ? 'selected' : ''}`}
                                onClick={() => setSelectedVariant(variant)}
                            >
                                {variant.id === 1 && (
                                    <div className="recommended-badge">
                                        <TrendingUp size={14} />
                                        Top Performer
                                    </div>
                                )}

                                <div className={`variant-preview aspect-${layout.id}`}>
                                    <div
                                        className="variant-mockup beauty-ad-mockup"
                                        style={{
                                            background: `linear-gradient(135deg, ${variant.theme.colors[0]}40, ${variant.theme.colors[1]}20)`,
                                        }}
                                    >
                                        {/* Beauty Ad Composition Mockup */}
                                        <div className="ad-content">
                                            <div className="ad-model-area">
                                                {modelData?.image ? (
                                                    <div className="model-avatar-mock">
                                                        <img src={modelData.image} alt="Model" className="model-img-real" />
                                                    </div>
                                                ) : (
                                                    <div className="model-placeholder">Model</div>
                                                )}
                                            </div>

                                            <div className="ad-product-area">
                                                <div className="product-circle" style={{ borderColor: variant.theme.colors[2] }}>
                                                    {productData ? (
                                                        <img src={productData} alt="Product" className="product-img-real text-contain" />
                                                    ) : (
                                                        <span className="product-emoji">💄</span>
                                                    )}
                                                </div>
                                                <div className="product-badge" style={{ background: variant.theme.colors[0] }}>
                                                    NEW
                                                </div>
                                            </div>

                                            <div className="ad-copy-area">
                                                <div className="ad-headline" style={{ color: variant.theme.colors[0] }}>
                                                    NEW LOOK
                                                </div>
                                                <div className="ad-subhead">
                                                    SAME AWARD WINNING TASTE
                                                </div>
                                                <div className="ad-cta">
                                                    Available in all major retailers
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="variant-format-tag">{variant.layout.format}</div>
                                </div>

                                <div className="variant-info">
                                    <h4>{variant.theme.name}</h4>
                                    <p className="variant-subtitle">{variant.layout.name} • {variant.layout.platform}</p>

                                    <div className="variant-metrics">
                                        <div className="metric">
                                            <span className="metric-label">CTR Prediction</span>
                                            <span className="metric-value highlight">{variant.ctrPrediction}%</span>
                                        </div>
                                        <div className="metric">
                                            <span className="metric-label">Visual Appeal</span>
                                            <span className="metric-value">{variant.visualAppeal}/100</span>
                                        </div>
                                        <div className="metric">
                                            <span className="metric-label">Relevance</span>
                                            <span className="metric-value">{variant.relevanceScore}/100</span>
                                        </div>
                                    </div>

                                    <div className="variant-footer">
                                        <div className="compliance-status">
                                            {variant.compliance === 'passed' ? (
                                                <>
                                                    <CheckCircle2 size={16} className="text-success" />
                                                    <span className="text-success">Compliant</span>
                                                </>
                                            ) : (
                                                <>
                                                    <AlertCircle size={16} className="text-warning" />
                                                    <span className="text-warning">Minor Issues</span>
                                                </>
                                            )}
                                            <span className="file-size">{variant.fileSize}KB</span>
                                        </div>
                                        <div className="variant-actions">
                                            <button className="action-btn" title="Preview">
                                                <Eye size={16} />
                                            </button>
                                            <button className="action-btn" title="Share">
                                                <Share2 size={16} />
                                            </button>
                                            <button
                                                className="action-btn primary"
                                                title="Download"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    exportVariant(variant);
                                                }}
                                            >
                                                <Download size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="variant-score-badge">
                                    {variant.overallScore}
                                </div>
                            </div>
                        ))}
                    </div>
                </div >
            )}

            {
                variants.length === 0 && !isGenerating && (
                    <div className="empty-state glass-panel">
                        <Sparkles size={64} className="empty-icon" />
                        <h3>Ready to Generate Variants</h3>
                        <p>Click "Generate Variants" to create AI-optimized creative variations</p>
                        <ul className="feature-list">
                            <li>✓ 10+ variations across themes & platforms</li>
                            <li>✓ ML-powered CTR predictions</li>
                            <li>✓ Auto Tesco compliance checking</li>
                            <li>✓ Optimized for &lt;500KB file size</li>
                        </ul>
                    </div>
                )
            }
        </div >
    );
};

export default VariantGenerator;
