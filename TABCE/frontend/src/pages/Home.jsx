import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Target, Cpu, Users, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: Sparkles,
            title: 'AI-Powered Generation',
            description: 'Generate 20+ professional beauty creatives in minutes using advanced AI'
        },
        {
            icon: Users,
            title: 'Diverse & Inclusive',
            description: '6 virtual models representing diverse demographics and ethnicities'
        },
        {
            icon: Cpu,
            title: '478-Point Face Mapping',
            description: 'Precision makeup application using MediaPipe facial landmark detection'
        },
        {
            icon: TrendingUp,
            title: 'ML Performance Prediction',
            description: 'Predict CTR, engagement, and conversion rates before launching'
        },
        {
            icon: Zap,
            title: '95% Cost Savings',
            description: 'Zero photoshoot costs, instant turnaround, unlimited variations'
        },
        {
            icon: Target,
            title: 'Brand Compliant',
            description: 'Automatically formats for Tesco guidelines and multi-platform specs'
        }
    ];

    const stats = [
        { value: '95%', label: 'Cost Reduction' },
        { value: '20+', label: 'Variants Generated' },
        { value: '5 min', label: 'Generation Time' },
        { value: '100%', label: 'Brand Safe' }
    ];

    const benefits = [
        'No photoshoot costs or logistics',
        'Infinite creative variations',
        'Real-time ML performance insights',
        'Multi-platform format optimization',
        'Inclusive representation guaranteed',
        'Instant A/B testing capabilities'
    ];

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <Sparkles size={16} />
                        <span>AI-Powered Beauty Creative Engine</span>
                    </div>
                    <h1 className="hero-title">
                        Generate <span className="text-gradient">Professional</span> Beauty Ads in{' '}
                        <span className="text-gradient">Minutes</span>
                    </h1>
                    <p className="hero-subtitle">
                        TABCE combines AI virtual models, 478-point facial mapping, and ML performance
                        prediction to create unlimited beauty creatives with zero photoshoot costs.
                    </p>
                    <div className="hero-actions">
                        <button className="btn btn-primary btn-large" onClick={() => navigate('/create')}>
                            <Sparkles size={20} />
                            Start Creating
                            <ArrowRight size={20} />
                        </button>
                        <button className="btn btn-secondary btn-large" onClick={() => navigate('/models')}>
                            View Model Library
                        </button>
                    </div>
                    <div className="hero-stats">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="stat-item">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="floating-card card-1">
                        <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop"
                            alt="AI Model"
                        />
                        <div className="card-badge">AI Generated</div>
                    </div>
                    <div className="floating-card card-2">
                        <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop"
                            alt="AI Model"
                        />
                        <div className="card-badge">478 Points</div>
                    </div>
                    <div className="floating-card card-3">
                        <img
                            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop"
                            alt="AI Model"
                        />
                        <div className="card-badge">ML Optimized</div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="features-section">
                <div className="section-header">
                    <h2>Why Choose TABCE?</h2>
                    <p>Revolutionary AI technology that transforms beauty creative production</p>
                </div>
                <div className="features-grid">
                    {features.map((feature, idx) => (
                        <div key={idx} className="feature-card glass-panel">
                            <div className="feature-icon">
                                <feature.icon size={28} />
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits-section">
                <div className="benefits-content">
                    <div className="benefits-text">
                        <h2>The Future of Beauty Marketing</h2>
                        <p className="benefits-intro">
                            Traditional beauty photoshoots cost £5K-15K and take 2-3 weeks.
                            TABCE delivers professional results in 5 minutes at zero cost.
                        </p>
                        <div className="benefits-list">
                            {benefits.map((benefit, idx) => (
                                <div key={idx} className="benefit-item">
                                    <CheckCircle size={20} className="check-icon" />
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-primary" onClick={() => navigate('/create')}>
                            Try It Now
                            <ArrowRight size={18} />
                        </button>
                    </div>
                    <div className="benefits-visual">
                        <div className="comparison-card">
                            <div className="comparison-old">
                                <div className="comparison-label">Traditional</div>
                                <div className="comparison-stat">£15,000</div>
                                <div className="comparison-sublabel">3 weeks</div>
                            </div>
                            <div className="comparison-new">
                                <div className="comparison-label">TABCE</div>
                                <div className="comparison-stat glow">£0</div>
                                <div className="comparison-sublabel">5 minutes</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Transform Your Beauty Creatives?</h2>
                    <p>Join the future of AI-powered beauty marketing</p>
                    <button className="btn btn-primary btn-large" onClick={() => navigate('/create')}>
                        <Sparkles size={20} />
                        Start Creating Now
                        <ArrowRight size={20} />
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;
