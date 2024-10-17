// src/components/RocketAnimation.tsx

import React, { useEffect } from 'react';
import Lottie from 'lottie-react';
import rocketAnimationData from '../animations/rocket-launcher.json';

interface RocketAnimationProps {
    onAnimationComplete: () => void;
}

const RocketAnimation: React.FC<RocketAnimationProps> = ({ onAnimationComplete }) => {
    useEffect(() => {
        const timer = setTimeout(onAnimationComplete, 5000); // Trajanje animacije
        return () => clearTimeout(timer);
    }, [onAnimationComplete]);

    return (
        <div
            style={{
                position: 'fixed', // Fiksirano preko cijelog prozora
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1000,
                pointerEvents: 'none', // Omogućuje interakciju s pozadinskim elementima
                display: 'flex',
                alignItems: 'flex-end', // Početak animacije od dna
                justifyContent: 'center',
            }}
        >
            <Lottie
                animationData={rocketAnimationData}
                loop={false}
                style={{ width: '300px', height: '600px' }}
            />
        </div>
    );
};

export default RocketAnimation;
