import React from 'react';

import "./Styles/DashboardCard.css";

interface DashboardCardProps {
    theme?: 'blue' | 'green' | 'purple' | 'orange' | 'cyan' | 'red' | 'gray';
    title: string;
    icon: React.ReactNode;
    value: string | number | React.ReactNode;
    subtext?: string | null;
    actionText?: string;
    onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
    theme = 'blue',
    title,
    icon,
    value,
    subtext,
    actionText,
    onClick
}) => {
    return (
        <div className={`common-card ${theme}`} onClick={onClick}>
            <div className={`common-icon-container ${theme}`}>
                {icon}
            </div>
            <h3 className="common-card-title">{title}</h3>
            <div className="common-card-value">
                {value}
            </div>
            {subtext && <p className="common-card-subtext">{subtext}</p>}

            {actionText && (
                <div className="common-card-footer">
                    <button className={`common-action-button ${theme}-text`}>
                        {actionText}
                        <i className="fa-solid fa-arrow-right common-arrow-icon"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default DashboardCard;
