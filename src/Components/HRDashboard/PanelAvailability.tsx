import React, { useEffect } from 'react';
import InterviewerCard from './InterviewerCard';
import styles from './PanelAvailability.module.css';

interface PanelAvailabilityProps {
    isOpen: boolean;
    onClose: () => void;
}

const PanelAvailability: React.FC<PanelAvailabilityProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);


    const mockData = [
        {
            name: "Dr. James Wilson",
            email: "james.wilson@company.com",
            schedule: [
                { day: "Monday", date: "Jan 19", isAvailable: true, slots: ["9:00 AM - 12:00 PM", "1:00 PM - 4:00 PM"] },
                { day: "Tuesday", date: "Jan 20", isAvailable: true, slots: ["9:00 AM - 12:00 PM"] },
                { day: "Wednesday", date: "Jan 21", isAvailable: false },
                { day: "Thursday", date: "Jan 22", isAvailable: true, slots: ["1:00 PM - 4:00 PM"] },
                { day: "Friday", date: "Jan 23", isAvailable: false },
                { day: "Saturday", date: "Jan 24", isAvailable: false },
                { day: "Sunday", date: "Jan 25", isAvailable: false },
            ]
        },
        {
            name: "Sarah Martinez",
            email: "sarah.martinez@company.com",
            schedule: [
                { day: "Monday", date: "Jan 19", isAvailable: true, slots: ["1:00 PM - 4:00 PM"] },
                { day: "Tuesday", date: "Jan 20", isAvailable: false },
                { day: "Wednesday", date: "Jan 21", isAvailable: true, slots: ["9:00 AM - 12:00 PM", "4:00 PM - 7:00 PM"] },
                { day: "Thursday", date: "Jan 22", isAvailable: false },
            ]
        }
    ];

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>Panel Availability - Next Week</h2>
                        <p className={styles.subtitle}>View interviewer schedules to assign candidates</p>
                    </div>
                    <button className={styles.closeButton} onClick={onClose}>
                        <span>Close</span>
                        {/* Some designs might just use icon or just text, using Text based on screenshot top right */}
                    </button>
                </div>

                <div className={styles.content}>
                    {mockData.map((interviewer, idx) => (
                        <InterviewerCard key={idx} interviewer={interviewer} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PanelAvailability;
