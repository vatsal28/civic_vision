import React from 'react';

interface ShareModalProps {
    originalImage: string;
    generatedImage: string;
    onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ originalImage, generatedImage, onClose }) => {
    const [isGenerating, setIsGenerating] = React.useState(false);

    const generateCompositeImage = async (): Promise<string> => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;

            const img1 = new Image();
            const img2 = new Image();

            img1.src = originalImage;
            img2.src = generatedImage;

            let loadedCount = 0;

            const onLoad = () => {
                loadedCount++;
                if (loadedCount === 2) {
                    // Set canvas dimensions (side by side layout)
                    canvas.width = img1.width + img2.width + 40; // 40px for spacing
                    canvas.height = Math.max(img1.height, img2.height) + 100; // Extra space for labels

                    // Fill background
                    ctx.fillStyle = '#0f172a';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Draw "BEFORE" label
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 32px Inter, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('BEFORE', img1.width / 2, 40);

                    // Draw first image
                    ctx.drawImage(img1, 0, 60, img1.width, img1.height);

                    // Draw divider
                    ctx.fillStyle = '#06b6d4';
                    ctx.fillRect(img1.width + 15, 60, 10, img1.height);

                    // Draw "AFTER" label
                    ctx.fillText('AFTER', img1.width + 30 + img2.width / 2, 40);

                    // Draw second image
                    ctx.drawImage(img2, img1.width + 30, 60, img2.width, img2.height);

                    // Add CivicVision branding at bottom
                    ctx.fillStyle = '#06b6d4';
                    ctx.font = 'bold 24px Inter, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('CIVIC VISION', canvas.width / 2, canvas.height - 30);

                    resolve(canvas.toDataURL('image/png'));
                }
            };

            img1.onload = onLoad;
            img2.onload = onLoad;
        });
    };

    const handleShare = async (platform: 'twitter' | 'facebook' | 'whatsapp') => {
        setIsGenerating(true);

        try {
            const compositeDataUrl = await generateCompositeImage();

            const shareText = 'Transformed this place using CivicVision, try it out https://civic-vision-tawny.vercel.app/';
            const encodedText = encodeURIComponent(shareText);

            // Convert data URL to blob for native sharing
            const response = await fetch(compositeDataUrl);
            const blob = await response.blob();
            const file = new File([blob], 'civic-vision-transformation.png', { type: 'image/png' });

            // Try native sharing first (for mobile)
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'CivicVision Transformation',
                    text: shareText,
                });
            } else {
                // Fallback: Open social media URL in new tab
                let shareUrl = '';

                switch (platform) {
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
                        break;
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://civic-vision-tawny.vercel.app/')}&quote=${encodedText}`;
                        break;
                    case 'whatsapp':
                        shareUrl = `https://wa.me/?text=${encodedText}`;
                        break;
                }

                // Download the image automatically
                const link = document.createElement('a');
                link.href = compositeDataUrl;
                link.download = 'civic-vision-transformation.png';
                link.click();

                // Open share URL
                window.open(shareUrl, '_blank');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            alert('Failed to share. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-center">
                    <h2 className="text-2xl font-bold text-white mb-1">Share Transformation</h2>
                    <p className="text-blue-100 text-sm">Show the world what's possible!</p>
                </div>

                <div className="p-6">
                    <p className="text-slate-300 text-sm mb-6 text-center">
                        Share your before/after transformation on social media
                    </p>

                    <div className="space-y-3">
                        {/* Twitter/X */}
                        <button
                            onClick={() => handleShare('twitter')}
                            disabled={isGenerating}
                            className="w-full flex items-center gap-4 p-4 bg-slate-700/50 hover:bg-[#1DA1F2] border border-slate-600 hover:border-[#1DA1F2] rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-white font-semibold">Share on X (Twitter)</div>
                                <div className="text-slate-400 text-xs">Post to your timeline</div>
                            </div>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Facebook */}
                        <button
                            onClick={() => handleShare('facebook')}
                            disabled={isGenerating}
                            className="w-full flex items-center gap-4 p-4 bg-slate-700/50 hover:bg-[#4267B2] border border-slate-600 hover:border-[#4267B2] rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-white font-semibold">Share on Facebook</div>
                                <div className="text-slate-400 text-xs">Post to your feed</div>
                            </div>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* WhatsApp */}
                        <button
                            onClick={() => handleShare('whatsapp')}
                            disabled={isGenerating}
                            className="w-full flex items-center gap-4 p-4 bg-slate-700/50 hover:bg-[#25D366] border border-slate-600 hover:border-[#25D366] rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-white font-semibold">Share on WhatsApp</div>
                                <div className="text-slate-400 text-xs">Send to contacts</div>
                            </div>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {isGenerating && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-cyan-400 text-sm">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating image...
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <button
                            onClick={onClose}
                            className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
