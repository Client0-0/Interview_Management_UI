import React from 'react';
import { UserCheck, Eye } from 'lucide-react';
import { useNavigate, useOutlet } from 'react-router-dom';
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

const candidates: Candidate[] = [
    {
        id: 1,
        name: "John Smith",
        role: "Senior Software Engineer",
        email: "john.smith@email.com",
        phone: "+1 (555) 123-4567",
        college: "MIT",
        skills: ["React", "Node.js", "TypeScript"],
        status: "scheduled",
        round: "Round 1/3",
        experience: "5 years experience",
        uploaded: "2025-11-28",
        scheduled: "2025-12-03",
        feedback: false,
        canMoveToNext: false,
        nextRound: "Round 2"
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
        round: "Round 1/3",
        experience: "7 years experience",
        uploaded: "2025-11-25",
        scheduled: "2025-11-30",
        feedback: "Excellent communication skills and product sense",
        canMoveToNext: true,
        nextRound: "Round 2"
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
        round: "Round 1/3",
        experience: "4 years experience",
        uploaded: "2025-11-26",
        scheduled: "2025-11-29",
        feedback: false,
        canMoveToNext: false,
        nextRound: "Round 2"
    }
];

const CandidatesToday: React.FC = () => {
    const navigate = useNavigate();
    const outlet = useOutlet();

    // If a child route (details) is active, render it full-page
    if (outlet) return outlet;

    const handleViewDetails = (candidate: Candidate) => {
        sessionStorage.setItem('hr_selected_candidate', JSON.stringify(candidate));
        navigate(`details/${candidate.id}`);
    };

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
                        <span className={styles.headerText}>{candidates.length} Candidates Scheduled for Today</span>
                    </div>
                    <div className={styles.date}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                <div className={styles.listContainer}>
                    {candidates.map((candidate) => (
                        <div key={candidate.id} className={styles.candidateCard}>
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
                                    onClick={() => handleViewDetails(candidate)}
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
