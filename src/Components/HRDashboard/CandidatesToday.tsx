import React from 'react';
import { UserCheck, Eye } from 'lucide-react';
import Header from './Header';
import styles from './CandidatesToday.module.css';

interface Candidate {
    id: number;
    name: string;
    role: string;
    email: string;
    phone: string;
    college: string;
    skills: string[];
    status: string;
    round: string;
    experience?: string;
    uploaded?: string;
    scheduled?: string;
    feedback?: string | boolean;
    canMoveToNext?: boolean;
    nextRound?: string;
}

interface CandidatesTodayProps {
    onViewDetails: (candidate: Candidate) => void;
}

const CandidatesToday: React.FC<CandidatesTodayProps> = ({ onViewDetails }) => {
    const candidates = [
        {
            id: 1,
            name: "John Smith",
            role: "Senior Software Engineer",
            email: "john.smith@email.com",
            phone: "+1 (555) 123-4567",
            college: "MIT",
            skills: ["React", "Node.js", "TypeScript"],
            status: "scheduled",
            round: "Round 1/3"
        },
        {
            id: 2,
            name: "Sarah Johnson",
            role: "Product Manager",
            email: "sarah.johnson@email.com",
            phone: "+1 (555) 234-5678",
            college: "Stanford",
            skills: ["Product Strategy", "Agile", "User Research"],
            status: "scheduled",
            round: "Round 1/3"
        },
        {
            id: 3,
            name: "Michael Chen",
            role: "UX Designer",
            email: "michael.chen@email.com",
            phone: "+1 (555) 345-6789",
            college: "RISD",
            skills: ["Figma", "Prototyping", "User Testing"],
            status: "scheduled",
            round: "Round 1/3"
        }
    ];

    return (
        <div className={styles.container}>
            <Header
                title="Candidates Today"
                subtitle={`${candidates.length} candidates scheduled`}
            />

            <main className={styles.mainContent}>
                <div className={styles.pageHeader}>
                    <div className={styles.stats}>
                        <UserCheck size={20} className={styles.headerIcon} />
                        <span className={styles.headerText}>3 Candidates Scheduled for Today</span>
                    </div>
                    <div className={styles.date}>Wednesday, January 14, 2026</div>
                </div>

                <div className={styles.listContainer}>
                    {candidates.map((candidate) => (
                        <div
                            key={candidate.id}
                            className={styles.candidateCard}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.nameSection}>
                                    <h3 className={styles.name}>{candidate.name}</h3>
                                    <div className={styles.badges}>
                                        <span className={styles.statusBadge}>{candidate.status}</span>
                                        <span className={styles.roundBadge}>{candidate.round}</span>
                                    </div>
                                </div>
                                <button
                                    className={styles.viewButton}
                                    onClick={() => onViewDetails(candidate)}
                                >
                                    <Eye size={16} />
                                    View Details
                                </button>
                            </div>

                            <div className={styles.role}>{candidate.role}</div>

                            <div className={styles.detailsGrid}>
                                <div>
                                    <label className={styles.label}>Email</label>
                                    <div className={styles.value}>{candidate.email}</div>
                                </div>
                                <div>
                                    <label className={styles.label}>Phone</label>
                                    <div className={styles.value}>{candidate.phone}</div>
                                </div>
                                <div>
                                    <label className={styles.label}>College</label>
                                    <div className={styles.value}>{candidate.college}</div>
                                </div>
                            </div>

                            <div className={styles.skillsSection}>
                                <label className={styles.label}>Skills</label>
                                <div className={styles.skillsList}>
                                    {candidate.skills.map((skill, index) => (
                                        <span key={index} className={styles.skillTag}>{skill}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default CandidatesToday;
