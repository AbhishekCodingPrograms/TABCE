import React, { useState, useEffect, useRef } from 'react';
import { Layers, Info, Loader2 } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import './FaceMeshVisualizer.css';

const FaceMeshVisualizer = ({ isActive = false, imageId }) => {
    const [detector, setDetector] = useState(null);
    const [faces, setFaces] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusText, setStatusText] = useState('Initializing AI...');
    const [activePointsLimit, setActivePointsLimit] = useState(0);

    // Load Model on Mount
    useEffect(() => {
        let isMounted = true;

        const loadModel = async () => {
            try {
                // Ensure backend is ready
                await tf.ready();

                const model = await faceLandmarksDetection.createDetector(
                    faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
                    {
                        runtime: 'tfjs',
                        refineLandmarks: true,
                        maxFaces: 1
                    }
                );

                if (isMounted) {
                    setDetector(model);
                    setIsLoading(false);
                    setStatusText('Ready to Scan');
                }
            } catch (err) {
                console.error("Error loading face mesh model:", err);
                if (isMounted) {
                    setIsLoading(false);
                    setStatusText('Model Error - Check Console');
                }
            }
        };

        loadModel();

        return () => { isMounted = false; };
    }, []);

    // Run Detection when Active and Image Ready
    useEffect(() => {
        if (!isActive || !detector || !imageId) return;

        const detectFace = async () => {
            const imgElement = document.getElementById(imageId);
            if (!imgElement) return;

            // Wait for image to be loaded if not already
            if (!imgElement.complete || imgElement.naturalWidth === 0) {
                setStatusText('Waiting for image...');
                await new Promise(resolve => {
                    imgElement.onload = resolve;
                    // Timeout just in case
                    setTimeout(resolve, 3000);
                });
            }

            setStatusText('Scanning facial landmarks...');
            try {
                const predictions = await detector.estimateFaces(imgElement);
                setFaces(predictions);

                if (predictions.length > 0) {
                    setStatusText('Face Detected');
                    // Animate the points appearing
                    let count = 0;
                    const interval = setInterval(() => {
                        count += 20;
                        setActivePointsLimit(count);
                        if (count >= 478) clearInterval(interval);
                    }, 50);
                } else {
                    setStatusText('No Face Detected');
                }
            } catch (error) {
                console.error("Detection Failed:", error);
                setStatusText('Detection Failed');
            }
        };

        detectFace();

    }, [isActive, detector, imageId]);


    const renderFaceMesh = () => {
        if (!faces.length) return null;

        const face = faces[0];
        const keypoints = face.keypoints;
        const imgElement = document.getElementById(imageId);

        if (!imgElement) return null;

        // Calculate geometry to match object-fit: cover
        const container = imgElement.getBoundingClientRect();
        const displayW = container.width;
        const displayH = container.height;
        const naturalW = imgElement.naturalWidth || 100;
        const naturalH = imgElement.naturalHeight || 100;

        if (displayW === 0 || displayH === 0) return null;

        const scaleX = displayW / naturalW;
        const scaleY = displayH / naturalH;
        const scale = Math.max(scaleX, scaleY); // object-fit: cover uses max

        const renderedW = naturalW * scale;
        const renderedH = naturalH * scale;

        const offsetX = (displayW - renderedW) / 2;
        const offsetY = (displayH - renderedH) / 2;

        return (
            <g className="landmark-points">
                {keypoints.map((point, index) => {
                    if (index > activePointsLimit) return null;

                    // Map from natural coordinates to displayed pixel coordinates
                    const pixelX = (point.x * scale) + offsetX;
                    const pixelY = (point.y * scale) + offsetY;

                    // Map from displayed pixels to SVG 0-100 space
                    const x = (pixelX / displayW) * 100;
                    const y = (pixelY / displayH) * 100;

                    // Highlight specific features
                    const isEye = (index >= 33 && index <= 133) || (index >= 362 && index <= 263);
                    const isLips = index >= 61 && index <= 146;

                    // check bounds if necessary, but SVG handles it.

                    return (
                        <circle
                            key={index}
                            cx={x}
                            cy={y}
                            r={isEye || isLips ? 0.35 : 0.25}
                            fill={index > activePointsLimit - 20 ? '#ffffff' : (isEye || isLips ? '#60a5fa' : 'rgba(148, 163, 184, 0.4)')}
                            className="mesh-point"
                        />
                    );
                })}
            </g>
        );
    };

    return (
        <div className={`face-mesh-visualizer ${isActive ? 'active' : ''}`}>
            <div className="visualizer-header">
                <div className="tech-badge">
                    <Layers size={16} />
                    <span>
                        {isLoading ? 'Loading AI Model...' : 'TensorFlow Face Mesh'}
                    </span>
                </div>
                <div className="mesh-stats">
                    <div className="stat-item">
                        <span className="stat-value">
                            {faces.length > 0 ? Math.min(activePointsLimit, 478) : 0}
                        </span>
                        <span className="stat-label">/ 478 Points</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{statusText}</span>
                    </div>
                </div>
            </div>

            <div className="mesh-canvas" style={{ opacity: faces.length ? 1 : 0.5 }}>
                {isLoading && (
                    <div className="loading-overlay">
                        <Loader2 className="animate-spin text-blue-500" size={32} />
                    </div>
                )}

                <svg className="mesh-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {renderFaceMesh()}
                </svg>
            </div>

            <div className="feature-indicators">
                <div className={`feature-indicator ${faces.length ? 'detected' : ''}`}>
                    <div className="indicator-dot"></div>
                    <span>Face</span>
                </div>
                <div className={`feature-indicator ${faces.length ? 'detected' : ''}`}>
                    <div className="indicator-dot"></div>
                    <span>Eyes</span>
                </div>
                <div className={`feature-indicator ${faces.length ? 'detected' : ''}`}>
                    <div className="indicator-dot"></div>
                    <span>Lips</span>
                </div>
                <div className={`feature-indicator ${faces.length ? 'detected' : ''}`}>
                    <div className="indicator-dot"></div>
                    <span>Contour</span>
                </div>
            </div>

            <div className="tech-info">
                <Info size={14} className="info-icon" />
                <span>Powered by TensorFlow.js MediaPipe FaceMesh</span>
            </div>
        </div>
    );
};

export default FaceMeshVisualizer;
