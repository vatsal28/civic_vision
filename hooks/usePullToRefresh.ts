import { useState, useEffect, useCallback } from 'react';

interface UsePullToRefreshOptions {
    onRefresh?: () => void;
    threshold?: number;
}

export const usePullToRefresh = (options: UsePullToRefreshOptions = {}) => {
    const { onRefresh, threshold = 100 } = options;
    const [isPulling, setIsPulling] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);

    const handleRefresh = useCallback(() => {
        if (onRefresh) {
            onRefresh();
        } else {
            window.location.reload();
        }
    }, [onRefresh]);

    useEffect(() => {
        let startY = 0;
        let currentY = 0;

        const handleTouchStart = (e: TouchEvent) => {
            // Only activate if we're at the top of the page
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (startY === 0) return;

            currentY = e.touches[0].clientY;
            const distance = currentY - startY;

            if (distance > 0 && window.scrollY === 0) {
                setIsPulling(true);
                setPullDistance(Math.min(distance, threshold * 1.5));

                // Prevent default scroll behavior when pulling
                if (distance > 10) {
                    e.preventDefault();
                }
            }
        };

        const handleTouchEnd = () => {
            if (pullDistance >= threshold) {
                handleRefresh();
            }

            setIsPulling(false);
            setPullDistance(0);
            startY = 0;
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [pullDistance, threshold, handleRefresh]);

    const progress = Math.min(pullDistance / threshold, 1);

    return {
        isPulling,
        pullDistance,
        progress,
    };
};
