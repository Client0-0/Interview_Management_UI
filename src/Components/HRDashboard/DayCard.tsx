import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import styles from './DayCard.module.css';

interface DayCardProps {
    day: string;
    date: string;
    slots?: string[];
    isAvailable?: boolean;
}

const DayCard: React.FC<DayCardProps> = ({ day, date, slots = [], isAvailable = false }) => {
    return (
        <div className={`${styles.card} ${isAvailable ? styles.available : styles.unavailable}`}>
            <div className={styles.header}>
                <Calendar size={14} className={styles.calendarIcon} />
                <div>
                    <div className={styles.day}>{day}</div>
                    <div className={styles.date}>{date}</div>
                </div>
            </div>

            <div className={styles.body}>
                {isAvailable && slots.length > 0 ? (
                    slots.map((slot, index) => (
                        <div key={index} className={styles.slot}>
                            <Clock size={12} className={styles.clockIcon} />
                            <span>{slot}</span>
                        </div>
                    ))
                ) : (
                    <div className={styles.notAvailable}>Not available</div>
                )}
            </div>
        </div>
    );
};

export default DayCard;
