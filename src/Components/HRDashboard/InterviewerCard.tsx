import React from 'react';
import { User } from 'lucide-react';
import DayCard from './DayCard';
import styles from './InterviewerCard.module.css';

interface Schedule {
    day: string;
    date: string;
    slots?: string[];
    isAvailable: boolean;
}

interface Interviewer {
    name: string;
    email: string;
    schedule: Schedule[];
}

interface InterviewerCardProps {
    interviewer: Interviewer;
}

const InterviewerCard: React.FC<InterviewerCardProps> = ({ interviewer }) => {
    const { name, email, schedule } = interviewer;

    return (
        <div className={styles.container}>
            <div className={styles.userInfo}>
                <div className={styles.avatar}>
                    <User size={20} className={styles.avatarIcon} />
                </div>
                <div>
                    <h3 className={styles.name}>{name}</h3>
                    <p className={styles.email}>{email}</p>
                </div>
            </div>

            <div className={styles.scheduleGrid}>
                {schedule.map((dayData, index) => (
                    <DayCard
                        key={index}
                        day={dayData.day}
                        date={dayData.date}
                        slots={dayData.slots}
                        isAvailable={dayData.isAvailable}
                    />
                ))}
            </div>
        </div>
    );
};

export default InterviewerCard;
