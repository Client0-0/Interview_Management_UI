
import React from 'react';

interface ProgressRingProps {
    radius?: number;
    stroke?: number;
    progress?: number;
    color?: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
    radius = 30,
    stroke = 4,
    progress = 0,
    color = '#3b82f6'
}) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div style={{ position: 'relative', width: radius * 2, height: radius * 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg
                height={radius * 2}
                width={radius * 2}
                style={{ transform: 'rotate(-90deg)' }}
            >
                {/* Background Ring */}
                <circle
                    stroke="#e2e8f0"
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                {/* Progress Ring */}
                <circle
                    stroke={color}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    style={{
                        strokeDasharray: circumference + ' ' + circumference,
                        strokeDashoffset,
                        transition: 'stroke-dashoffset 1.5s ease-out'
                    }}
                />
            </svg>
            {/* Percentage Text centered */}
            <div style={{ position: 'absolute', fontSize: '0.5rem', fontWeight: '600', color: '#64748b' }}>
                {progress}%
            </div>
        </div>
    );
};

export default ProgressRing;
