/**
 * ImageCropper - Simple WordPress-style cropper
 * Clean and minimal UI
 */
import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Cropper from 'react-cropper';
import type { ReactCropperElement } from 'react-cropper';
import 'react-cropper/node_modules/cropperjs/dist/cropper.css';
import './ImageCropper.css';

interface ImageCropperProps {
    imageSrc: string;
    onCrop: (croppedBlob: Blob) => void;
    onCancel: () => void;
    aspectRatio?: number;
}

export default function ImageCropper({
    imageSrc,
    onCrop,
    onCancel,
    aspectRatio = 1
}: ImageCropperProps) {
    const cropperRef = useRef<ReactCropperElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Reset crop
    const handleReset = useCallback(() => {
        cropperRef.current?.cropper?.reset();
    }, []);

    // Process crop
    const handleCrop = useCallback(() => {
        const cropper = cropperRef.current?.cropper;
        if (!cropper) return;

        setIsProcessing(true);
        const canvas = cropper.getCroppedCanvas({
            width: 800,
            height: 800,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high'
        });

        canvas.toBlob(
            (blob) => {
                if (blob) {
                    onCrop(blob);
                }
                setIsProcessing(false);
            },
            'image/jpeg',
            0.9
        );
    }, [onCrop]);

    // Viewport lock & Escape key
    useEffect(() => {
        const originalBodyOverflow = document.body.style.overflow;
        const originalHtmlOverflow = document.documentElement.style.overflow;
        const originalTouchAction = document.body.style.touchAction;

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalBodyOverflow;
            document.documentElement.style.overflow = originalHtmlOverflow;
            document.body.style.touchAction = originalTouchAction;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onCancel]);

    return createPortal(
        <div
            className="image-cropper-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onCancel();
            }}
            onWheel={(e) => {
                if (e.target === e.currentTarget) e.preventDefault();
            }}
            onTouchMove={(e) => {
                if (e.target === e.currentTarget) e.preventDefault();
            }}
            role="dialog"
            aria-modal="true"
        >
            <div className="image-cropper-modal">
                {/* Header */}
                <div className="image-cropper-header">
                    <span>Crop image</span>
                    <button className="image-cropper-close" onClick={onCancel}>×</button>
                </div>

                {/* Cropper */}
                <div className="image-cropper-body">
                    <Cropper
                        ref={cropperRef}
                        src={imageSrc}
                        style={{ height: '100%', width: '100%' }}
                        aspectRatio={aspectRatio}
                        viewMode={1}
                        guides={true}
                        center={true}
                        background={true}
                        responsive={true}
                        autoCropArea={0.9}
                        checkOrientation={true}
                        dragMode="crop"
                        cropBoxMovable={true}
                        cropBoxResizable={true}
                    />
                </div>

                {/* Footer */}
                <div className="image-cropper-footer">
                    <button className="image-cropper-btn image-cropper-btn--reset" onClick={handleReset}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                        Reset crop
                    </button>
                    <div className="image-cropper-actions">
                        <button
                            className="image-cropper-btn image-cropper-btn--cancel"
                            onClick={onCancel}
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                        <button
                            className="image-cropper-btn image-cropper-btn--crop"
                            onClick={handleCrop}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Cropping...' : 'Crop'}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
