// src/components/RocketAnimation.tsx

import React from 'react';
import Lottie from 'lottie-react';
import rocketAnimationData from '../animations/rocket-launcher.json';

interface RocketAnimationProps {
    onAnimationComplete: () => void;
    size?: number; // Opcionalni prop za veličinu
}

const RocketAnimation: React.FC<RocketAnimationProps> = ({ onAnimationComplete, size = 300 }) => {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center', // Centrirano vertikalno
                justifyContent: 'center', // Centrirano horizontalno
            }}
        >
            <Lottie
                animationData={rocketAnimationData}
                loop={false}
                style={{ width: size, height: size }}
                onComplete={onAnimationComplete} // Koristimo onComplete prop
            />
        </div>
    );
};

export default RocketAnimation;
