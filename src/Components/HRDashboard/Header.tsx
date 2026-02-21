import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
    userEmail?: string;
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
    userEmail = 'hr@gmail.com',
    title = "HR Dashboard",
    subtitle,
    action,
}) => {
    return (
        <header className={styles.header}>
            <div className={styles.leftSection}>
                <div className={styles.titleContainer}>
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.subtitle}>
                        {subtitle ? subtitle : `Welcome back, ${userEmail}`}
                    </p>
                </div>
            </div>
            <div className={styles.rightSection}>
                {action && <div className={styles.actionContainer}>{action}</div>}
            </div>
        </header>
    );
};

export default Header;
