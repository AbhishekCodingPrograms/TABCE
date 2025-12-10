import React, { useState } from 'react';
import {
    Upload,
    User,
    Palette,
    Layout,
    CheckCircle,
    ChevronRight,
    ChevronLeft,
    Wand2,
    Download,
    Share2,
    Sparkles,
    RotateCcw
} from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion'; // Removed for robustness
import './CreativeStudio.css';
import FaceMeshVisualizer from '../components/FaceMeshVisualizer';
import PerformancePredictor from '../components/PerformancePredictor';
import VariantGenerator from '../components/VariantGenerator';

const steps = [
    { id: 1, title: 'Upload Product', icon: Upload },
    { id: 2, title: 'Select Model', icon: User },
    { id: 3, title: 'Apply Makeup', icon: Palette },
    { id: 4, title: 'AI Analysis', icon: Sparkles },
    { id: 5, title: 'Generate Variants', icon: Layout },
];

const MOCK_MODELS = [
    { id: 1, name: 'Aisha', ethnicity: 'South Asian', age: '20s', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'Sarah', ethnicity: 'Caucasian', age: '30s', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'Wei', ethnicity: 'East Asian', age: '20s', image: 'https://images.unsplash.com/photo-1506795660198-e95c77602129?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { id: 4, name: 'Zahra', ethnicity: 'Middle Eastern', age: '20s', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { id: 5, name: 'Elena', ethnicity: 'Hispanic', age: '20s', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { id: 6, name: 'Nia', ethnicity: 'Black', age: '30s', image: 'https://images.unsplash.com/photo-1531123418162-18fb630f943d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
];

const CreativeStudio = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [productFileName, setProductFileName] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [makeupConfig, setMakeupConfig] = useState({
        lipstick: '#E0001B',
        lipIntensity: 70,
        blush: '#ff9999',
        blushIntensity: 50,
        eyeshadow: '#8b7355',
        eyeshadowIntensity: 60,
        foundation: '#f5d5b8',
        foundationCoverage: 40,
        eyeliner: '#000000',
        eyelinerThickness: 30,
        highlight: '#FFE4B5',
        highlightIntensity: 40,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [showFaceMesh, setShowFaceMesh] = useState(false);
    const [creativeData, setCreativeData] = useState(null);
    const [generationProgress, setGenerationProgress] = useState(0);

    // Enhanced file upload with validation
    const handleFileUpload = (event) => {
        const file = event?.target?.files?.[0];

        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setUploadError('Please upload a valid image (JPG, PNG, or WebP)');
                return;
            }

            // Validate file size (5MB max)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                setUploadError('File size must be less than 5MB');
                return;
            }

            // Read and display the file
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedProduct(e.target.result);
                setProductFileName(file.name);
                setUploadError('');

                // Auto-advance after successful upload
                setTimeout(() => {
                    if (currentStep === 1) setCurrentStep(2);
                }, 800);
            };
            reader.readAsDataURL(file);
        } else {
            // Fallback to demo image if no file selected
            setSelectedProduct('https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80');
            setProductFileName('demo-product.jpg');
            setTimeout(() => {
                if (currentStep === 1) setCurrentStep(2);
            }, 500);
        }
    };

    const handleNext = () => {
        if (currentStep === 3) {
            // Generate creative with progress simulation
            setIsGenerating(true);
            setGenerationProgress(0);

            const progressInterval = setInterval(() => {
                setGenerationProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 300);

            setTimeout(() => {
                clearInterval(progressInterval);
                setIsGenerating(false);
                setGenerationProgress(100);
                setCreativeData({
                    product: selectedProduct,
                    productName: productFileName,
                    model: selectedModel,
                    makeup: makeupConfig,
                    timestamp: new Date().toISOString(),
                    id: `creative-${Date.now()}`
                });
                setCurrentStep(4);
            }, 3500);
        } else if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const resetWorkflow = () => {
        if (window.confirm('Are you sure you want to start over? All current progress will be lost.')) {
            setCurrentStep(1);
            setSelectedProduct(null);
            setSelectedModel(null);
            setCreativeData(null);
            setProductFileName('');
            setUploadError('');
            setGenerationProgress(0);
            setMakeupConfig({
                lipstick: '#E0001B',
                lipIntensity: 70,
                blush: '#ff9999',
                blushIntensity: 50,
                eyeshadow: '#8b7355',
                eyeshadowIntensity: 60,
                foundation: '#f5d5b8',
                foundationCoverage: 40,
                eyeliner: '#000000',
                eyelinerThickness: 30,
                highlight: '#FFE4B5',
                highlightIntensity: 40,
            });
        }
    };

    const presetMakeupLooks = [
        {
            name: 'Natural',
            lipstick: '#FFB6C1',
            lipIntensity: 60,
            eyeshadow: '#DEB887',
            eyeshadowIntensity: 45,
            blush: '#FFE4E1',
            blushIntensity: 35
        },
        {
            name: 'Glam',
            lipstick: '#DC143C',
            lipIntensity: 85,
            eyeshadow: '#8B4513',
            eyeshadowIntensity: 70,
            blush: '#FF69B4',
            blushIntensity: 60
        },
        {
            name: 'Bold',
            lipstick: '#8B0000',
            lipIntensity: 95,
            eyeshadow: '#000000',
            eyeshadowIntensity: 80,
            blush: '#FF1493',
            blushIntensity: 70
        },
        {
            name: 'Festive',
            lipstick: '#E0001B',
            lipIntensity: 80,
            eyeshadow: '#FFD700',
            eyeshadowIntensity: 65,
            blush: '#FFA500',
            blushIntensity: 55
        },
    ];

    const applyPreset = (preset) => {
        setMakeupConfig(prev => ({
            ...prev,
            lipstick: preset.lipstick,
            lipIntensity: preset.lipIntensity,
            eyeshadow: preset.eyeshadow,
            eyeshadowIntensity: preset.eyeshadowIntensity,
            blush: preset.blush,
            blushIntensity: preset.blushIntensity,
        }));
    };

    return (
        <div className="studio-container">
            {/* Header */}
            <div className="studio-header">
                <div className="header-content">
                    <h1 className="page-title">🎨 Creative Studio</h1>
                    <p className="page-subtitle">AI-Powered Beauty Creative Generation System</p>
                </div>
                {currentStep > 1 && (
                    <button className="btn btn-secondary btn-sm" onClick={resetWorkflow}>
                        <RotateCcw size={16} />
                        Start Over
                    </button>
                )}
            </div>

            {/* Steps Indicator */}
            <div className="steps-indicator">
                {steps.map((step, index) => (
                    <div key={step.id} className={`step-item ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}>
                        <div
                            className="step-icon"
                        >
                            {currentStep > step.id ? <CheckCircle size={18} /> : <step.icon size={18} />}
                        </div>
                        <span className="step-label">{step.title}</span>
                        {index < steps.length - 1 && <div className="step-line" />}
                    </div>
                ))}
            </div>

            {/* Workspace */}
            <div className="studio-workspace">
                <div className="workspace-content">
                    {/* Fallback to standard rendering to ensure visibility */}
                    {currentStep === 1 && (
                        <div className="step-content upload-step">
                            <div className="upload-zone" onClick={() => document.getElementById('product-upload').click()}>
                                <input
                                    type="file"
                                    id="product-upload"
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                />
                                <div className="upload-icon">
                                    <Upload size={48} />
                                </div>
                                <h3>Upload Product Image</h3>
                                <p>Drag & drop or click to browse</p>
                                <div className="upload-specs">
                                    <span>JPG, PNG, WebP</span>
                                    <span>Max 5MB</span>
                                    <span>Min 1024px width</span>
                                </div>
                                {uploadError && <p className="error-message">{uploadError}</p>}
                            </div>

                            {selectedProduct && (
                                <div className="upload-preview">
                                    <img src={selectedProduct} alt="Selected Product" />
                                    <div className="check-icon"><CheckCircle size={16} /></div>
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="step-content model-step">
                            <div className="step-header">
                                <h3>Select AI-Generated Virtual Model</h3>
                                <p>Choose from diverse, inclusive models representing Tesco's shoppers</p>
                            </div>
                            <div className="models-grid-enhanced">
                                {MOCK_MODELS.map((model) => (
                                    <div
                                        key={model.id}
                                        className={`model-card-enhanced ${selectedModel === model.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedModel(model.id)}
                                    >
                                        <div className="model-image-container">
                                            <img src={model.image} alt={model.name} />
                                            {selectedModel === model.id && (
                                                <div className="selected-overlay">
                                                    <CheckCircle size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="model-details">
                                            <h4>{model.name}</h4>
                                            <div className="model-tags">
                                                <span className="tag">{model.ethnicity}</span>
                                                <span className="tag">{model.age}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && !isGenerating && (
                        <div className="step-content makeup-step">
                            <div className="step-header">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <div>
                                        <h3>Virtual Makeup Application</h3>
                                        <p>FaceClone 478-point landmark system for realistic makeup rendering</p>
                                    </div>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => setShowFaceMesh(!showFaceMesh)}
                                    >
                                        <Sparkles size={16} />
                                        {showFaceMesh ? 'Hide' : 'Show'} Face Mesh
                                    </button>
                                </div>
                            </div>

                            <div className="makeup-workspace">
                                <div className="makeup-preview-panel">
                                    <div className="model-preview-container">
                                        <img
                                            id="model-preview-img"
                                            crossOrigin="anonymous"
                                            src={
                                                MOCK_MODELS.find(m => m.id === (selectedModel || 1))?.image
                                            }
                                            alt="Model Preview"
                                            className="model-preview-image"
                                        />
                                        {/* Simulated Makeup Overlays */}
                                        <div
                                            className="makeup-layer lipstick-layer"
                                            style={{
                                                backgroundColor: makeupConfig.lipstick,
                                                opacity: makeupConfig.lipIntensity / 100,
                                            }}
                                        />
                                        <div
                                            className="makeup-layer blush-layer"
                                            style={{
                                                backgroundColor: makeupConfig.blush,
                                                opacity: makeupConfig.blushIntensity / 100,
                                            }}
                                        />
                                    </div>

                                    {showFaceMesh && (
                                        <div className="face-mesh-overlay">
                                            <FaceMeshVisualizer isActive={true} imageId="model-preview-img" />
                                        </div>
                                    )}
                                </div>

                                <div className="makeup-controls">
                                    <div className="preset-looks">
                                        <h4>Quick Presets</h4>
                                        <div className="preset-buttons">
                                            {presetMakeupLooks.map(preset => (
                                                <button
                                                    key={preset.name}
                                                    className="preset-btn"
                                                    onClick={() => applyPreset(preset)}
                                                >
                                                    {preset.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="control-section">
                                        <h4>💋 Lipstick</h4>
                                        <div className="control-group">
                                            <div className="color-picker-row">
                                                {['#E0001B', '#D63384', '#BE123C', '#9F1239', '#FF6B9D', '#FFB6C1'].map(color => (
                                                    <button
                                                        key={color}
                                                        className={`color-swatch ${makeupConfig.lipstick === color ? 'active' : ''}`}
                                                        style={{ backgroundColor: color }}
                                                        onClick={() => setMakeupConfig({ ...makeupConfig, lipstick: color })}
                                                    />
                                                ))}
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={makeupConfig.lipIntensity}
                                                onChange={(e) => setMakeupConfig({ ...makeupConfig, lipIntensity: parseInt(e.target.value) })}
                                                className="range-slider mt-4"
                                            />
                                        </div>
                                    </div>

                                    <div className="control-section">
                                        <h4>✨ Blush</h4>
                                        <div className="control-group">
                                            <div className="color-picker-row">
                                                {['#ff9999', '#ffb3ba', '#FF69B4', '#FFE4E1', '#FFC0CB'].map(color => (
                                                    <button
                                                        key={color}
                                                        className={`color-swatch ${makeupConfig.blush === color ? 'active' : ''}`}
                                                        style={{ backgroundColor: color }}
                                                        onClick={() => setMakeupConfig({ ...makeupConfig, blush: color })}
                                                    />
                                                ))}
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={makeupConfig.blushIntensity}
                                                onChange={(e) => setMakeupConfig({ ...makeupConfig, blushIntensity: parseInt(e.target.value) })}
                                                className="range-slider mt-4"
                                            />
                                        </div>
                                    </div>

                                    <div className="control-section">
                                        <h4>👁️ Eyeshadow</h4>
                                        <div className="control-group">
                                            <div className="color-picker-row">
                                                {['#8b7355', '#a0826d', '#bc8f8f', '#deb887', '#d2691e', '#8b4513'].map(color => (
                                                    <button
                                                        key={color}
                                                        className={`color-swatch ${makeupConfig.eyeshadow === color ? 'active' : ''}`}
                                                        style={{ backgroundColor: color }}
                                                        onClick={() => setMakeupConfig({ ...makeupConfig, eyeshadow: color })}
                                                    />
                                                ))}
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={makeupConfig.eyeshadowIntensity}
                                                onChange={(e) => setMakeupConfig({ ...makeupConfig, eyeshadowIntensity: parseInt(e.target.value) })}
                                                className="range-slider mt-4"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && isGenerating && (
                        <div className="step-content generate-loading">
                            <div className="loading-animation">
                                <div className="wand-container">
                                    <Wand2 size={64} className="wand-icon" />
                                </div>
                                <h3>AI is Generating Your Creative...</h3>
                                <div className="loading-steps">
                                    <div className="loading-step">🎨 Analyzing facial landmarks...</div>
                                    <div className="loading-step">💄 Applying virtual makeup...</div>
                                    <div className="loading-step">📐 Composing Tesco-compliant layout...</div>
                                    <div className="loading-step">🤖 Running ML prediction models...</div>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="step-content analysis-step">
                            <PerformancePredictor creativeData={creativeData} />
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="step-content variants-step">
                            <VariantGenerator
                                productData={selectedProduct}
                                modelData={MOCK_MODELS.find(m => m.id === selectedModel)}
                                makeupConfig={makeupConfig}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="workspace-footer">
                <button
                    className="btn btn-secondary"
                    onClick={handleBack}
                    disabled={currentStep === 1 || isGenerating}
                >
                    <ChevronLeft size={18} /> Back
                </button>
                <div className="footer-info">
                    Step {currentStep} of {steps.length}
                </div>
                <button
                    className="btn btn-primary"
                    onClick={handleNext}
                    disabled={
                        currentStep === 5 ||
                        isGenerating ||
                        (currentStep === 1 && !selectedProduct) ||
                        (currentStep === 2 && !selectedModel)
                    }
                >
                    {currentStep === 4 ? 'Generate Variants' : 'Next'} <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default CreativeStudio;
