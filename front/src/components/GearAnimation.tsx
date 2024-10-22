// src/components/GearAnimation.tsx

import React, { useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import gearAnimationData from '../animations/gear-animation.json';

interface GearAnimationProps {
    isSpinning: boolean;
    size?: number;
}

const GearAnimation: React.FC<GearAnimationProps> = ({ isSpinning }) => {
    const lottieRef = useRef<any>(null);

    useEffect(() => {
        if (lottieRef.current) {
            if (isSpinning) {
                lottieRef.current.play();
            } else {
                lottieRef.current.pause();
            }
        }
    }, [isSpinning]);

    return (
        <div style={{ width: '390px', height: '390px' }}>
            <Lottie
                lottieRef={lottieRef}
                animationData={gearAnimationData}
                loop={true}
                autoplay={false} // Kontroliramo reprodukciju putem isSpinning
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default GearAnimation;
