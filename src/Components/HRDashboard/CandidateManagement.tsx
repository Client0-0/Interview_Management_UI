import React, { useState } from 'react';
import { Upload, Mail, Phone, Calendar, Briefcase, CheckCircle, Clock, Users, ArrowUpRight, Eye, Filter } from 'lucide-react';
import Header from './Header';
import ProgressRing from './ProgressRing';
import styles from './CandidateManagement.module.css';

interface Candidate {
    id: number;
    name: string;
    role: string;
    email: string;
    phone: string;
    experience?: string;
    uploaded?: string;
    scheduled?: string;
    status: string;
    round: string;
    college: string;
    skills: string[];
    feedback?: string | boolean;
    canMoveToNext?: boolean;
    nextRound?: string;
}

interface CandidateManagementProps {
    onBulkUpload: () => void;
    onViewDetails: (candidate: Candidate) => void;
}

const CandidateManagement: React.FC<CandidateManagementProps> = ({ onBulkUpload, onViewDetails }) => {
    const [activeTab, setActiveTab] = useState('All Candidates');
    const [showFilters, setShowFilters] = useState(true);

    // Filter States
    const [filters, setFilters] = useState({
        college: 'All Colleges',
        round: 'All Rounds',
        role: 'All Roles',
        techStack: 'All Tech Stacks'
    });

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Mock Metrics Data
    // Mock Metrics Data with Visualization Types
    const metrics = [
        {
            title: 'Total Candidates',
            value: '5',
            icon: Users,
            color: 'text-gray-600',
            strokeColor: '#475569',
            type: 'text'
        },
        {
            title: 'Hiring Goal',
            value: '50%',
            icon: CheckCircle,
            color: 'text-green-500',
            strokeColor: '#22c55e',
            type: 'progress',
            progress: 50
        },
        {
            title: 'Pending',
            value: '1',
            icon: Clock,
            color: 'text-orange-500',
            strokeColor: '#f97316',
            type: 'progress',
            progress: 20
        },
    ];

    // Specific Mock Candidates with enriched data for filtering
    const initialCandidates = [
        {
            id: 1,
            name: "John Smith",
            role: "Senior Software Engineer",
            email: "john.smith@email.com",
            phone: "+1 (555) 123-4567",
            experience: "5 years experience",
            uploaded: "2025-11-28",
            scheduled: "2025-12-03",
            status: "scheduled",
            round: "Round 1/3",
            college: "MIT",
            skills: ["React", "Node.js", "TypeScript"],
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
            experience: "7 years experience",
            uploaded: "2025-11-25",
            scheduled: "2025-11-30",
            status: "selected",
            round: "Round 1/3",
            college: "Stanford",
            skills: ["Product Strategy", "Agile", "User Research"],
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
            experience: "4 years experience",
            uploaded: "2025-11-26",
            scheduled: "2025-11-29",
            status: "rejected",
            round: "Round 1/3",
            college: "Other",
            skills: ["Figma", "User Research", "Prototyping"],
            feedback: "Good technical skills but lacks experience in our domain",
            canMoveToNext: false,
            nextRound: "Round 2"
        },
        {
            id: 4,
            name: "Emily Rodriguez",
            role: "Data Scientist",
            email: "emily.rodriguez@email.com",
            phone: "+1 (555) 456-7890",
            experience: "6 years experience",
            uploaded: "2025-11-27",
            status: "pending",
            round: "Round 1/3",
            college: "Other",
            skills: ["Python", "Machine Learning", "SQL"],
            feedback: false,
            canMoveToNext: false,
            nextRound: "Round 2"
        },
        {
            id: 5,
            name: "David Lee",
            role: "Senior Software Engineer",
            email: "david.lee@email.com",
            phone: "+1 (555) 567-8901",
            experience: "5 years experience",
            uploaded: "2025-11-24",
            scheduled: "2025-12-05",
            status: "selected",
            round: "Round 2/3",
            college: "Other",
            skills: ["AWS", "Docker", "Kubernetes"],
            feedback: "Strong technical background, moved to round 2",
            canMoveToNext: true,
            nextRound: "Round 3"
        }
    ];

    const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);

    // Calculate dynamic tab counts based on current candidates state
    const getCount = (status: string) => {
        if (status === 'All Candidates') return candidates.length;
        return candidates.filter(c => c.status.toLowerCase() === status.toLowerCase()).length;
    };

    // Tabs with dynamic counts
    const tabs = [
        { name: 'All Candidates', count: getCount('All Candidates') },
        { name: 'Pending', count: getCount('pending') },
        { name: 'Scheduled', count: getCount('scheduled') },
        { name: 'Selected', count: getCount('selected') },
        { name: 'Rejected', count: getCount('rejected') },
    ];

    const handleMoveToNextRound = (candidateId: number) => {
        setCandidates((prevCandidates: Candidate[]) => prevCandidates.map((candidate: Candidate) => {
            if (candidate.id !== candidateId) return candidate;

            // Parse current round (e.g., "Round 1/3")
            const roundParts = candidate.round.match(/Round (\d+)\/(\d+)/);
            if (!roundParts) return candidate;

            const currentRoundNum = parseInt(roundParts[1]);
            const totalRounds = parseInt(roundParts[2]);

            if (currentRoundNum >= totalRounds) return candidate; // Cannot move past max

            const newRoundNum = currentRoundNum + 1;
            const newRoundStr = `Round ${newRoundNum}/${totalRounds}`;
            const newNextRoundStr = `Round ${newRoundNum + 1}`; // For the button text in future

            return {
                ...candidate,
                status: 'pending', // Update status to pending
                round: newRoundStr, // Update round (e.g., Round 2/3)
                canMoveToNext: false, // Reset action button availability
                nextRound: newNextRoundStr // Update next target
            };
        }));
    };

    // Filtering Logic
    const filteredCandidates = candidates.filter(candidate => {
        // 1. Tab Status Filter
        if (activeTab !== 'All Candidates' && candidate.status.toLowerCase() !== activeTab.toLowerCase()) {
            return false;
        }

        // 2. College Filter
        if (filters.college !== 'All Colleges' && candidate.college !== filters.college) {
            return false;
        }

        // 3. Round Filter
        if (filters.round !== 'All Rounds') {
            const roundNumber = filters.round.replace('Round ', ''); // e.g., "1"
            if (!candidate.round.includes(`Round ${roundNumber}`)) {
                return false;
            }
        }

        // 4. Role Filter
        if (filters.role !== 'All Roles' && candidate.role !== filters.role) {
            return false;
        }

        // 5. Tech Stack Filter (Skills check)
        if (filters.techStack !== 'All Tech Stacks') {
            if (!candidate.skills.includes(filters.techStack)) {
                return false;
            }
        }

        return true;
    });

    // Helper for Status Badge Class
    const getStatusClass = (status: string) => {
        switch (status) {
            case 'pending': return styles.statusPending;
            case 'scheduled': return styles.statusScheduled;
            case 'selected': return styles.statusSelected;
            case 'rejected': return styles.statusRejected;
            default: return '';
        }
    };

    return (
        <div className={styles.container}>
            <Header
                title="Candidate Management"
                subtitle={`${filteredCandidates.length} candidates`}
                action={
                    <button className={styles.bulkUploadButton} onClick={onBulkUpload}>
                        <Upload size={18} />
                        Bulk Upload
                    </button>
                }
            />

            <main className={styles.mainContent}>
                {/* Metrics Dashboard */}
                <div className={styles.metricsGrid}>
                    {metrics.map((metric, index) => (
                        <div key={index} className={styles.metricCard}>
                            <div className={styles.metricHeader}>
                                <metric.icon size={20} className={`${styles.metricIcon} ${metric.color === 'text-orange-500' ? styles.orange : metric.color === 'text-green-500' ? styles.green : metric.color === 'text-red-500' ? styles.red : metric.color === 'text-blue-500' ? styles.blue : styles.gray}`} />
                                <div className={styles.metricTitle}>{metric.title}</div>
                            </div>

                            <div className={styles.metricContent}>
                                <div className={styles.metricValue}>{metric.value}</div>

                                <div className={styles.visualContainer}>
                                    {/* Conditional Logic for Visuals based on Metric Type */}
                                    {metric.type === 'progress' && (
                                        <ProgressRing radius={20} stroke={3} progress={metric.progress} color={metric.strokeColor} />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters and List */}
                <div className={styles.contentCard}>

                    {/* Filters Section */}
                    <div className={styles.filtersContainer}>
                        <div className={styles.filtersHeader}>
                            <div className={styles.filtersTitle}>
                                <Filter size={16} />
                                <span>Filters</span>
                            </div>
                            <button
                                className={styles.toggleFiltersButton}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </button>
                        </div>

                        {showFilters && (
                            <div className={styles.filtersRow}>
                                <div className={styles.filterGroup}>
                                    <label>College</label>
                                    <select
                                        className={styles.select}
                                        value={filters.college}
                                        onChange={(e) => handleFilterChange('college', e.target.value)}
                                    >
                                        <option>All Colleges</option>
                                        <option>MIT</option>
                                        <option>Stanford</option>
                                    </select>
                                </div>
                                <div className={styles.filterGroup}>
                                    <label>Round/Stage</label>
                                    <select
                                        className={styles.select}
                                        value={filters.round}
                                        onChange={(e) => handleFilterChange('round', e.target.value)}
                                    >
                                        <option>All Rounds</option>
                                        <option>Round 1</option>
                                        <option>Round 2</option>
                                        <option>Round 3</option>
                                    </select>
                                </div>
                                <div className={styles.filterGroup}>
                                    <label>Role</label>
                                    <select
                                        className={styles.select}
                                        value={filters.role}
                                        onChange={(e) => handleFilterChange('role', e.target.value)}
                                    >
                                        <option>All Roles</option>
                                        <option>Senior Software Engineer</option>
                                        <option>Product Manager</option>
                                        <option>UX Designer</option>
                                        <option>Data Scientist</option>
                                    </select>
                                </div>
                                <div className={styles.filterGroup}>
                                    <label>Tech Stack</label>
                                    <select
                                        className={styles.select}
                                        value={filters.techStack}
                                        onChange={(e) => handleFilterChange('techStack', e.target.value)}
                                    >
                                        <option>All Tech Stacks</option>
                                        <option>React</option>
                                        <option>Python</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.tabsSection}>
                        <div className={styles.tabs}>
                            {tabs.map((tab) => (
                                <button
                                    key={tab.name}
                                    className={`${styles.tab} ${activeTab === tab.name ? styles.activeTab : ''}`}
                                    onClick={() => setActiveTab(tab.name)}
                                >
                                    {tab.name} ({tab.count})
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.listContainer}>
                        {filteredCandidates.length > 0 ? (
                            filteredCandidates.map(candidate => (
                                <div
                                    key={candidate.id}
                                    className={styles.candidateRow}
                                >
                                    <div className={styles.rowHeader}>
                                        <div className={styles.infoLeft}>
                                            <div className={styles.nameRow}>
                                                <h3 className={styles.name}>{candidate.name}</h3>
                                                <span className={`${styles.statusBadge} ${getStatusClass(candidate.status)}`}>
                                                    {candidate.status}
                                                </span>
                                                <span className={styles.roundBadge}>{candidate.round}</span>
                                            </div>
                                            <div className={styles.role}>{candidate.role}</div>
                                        </div>

                                        <div className={styles.actions}>
                                            {candidate.canMoveToNext && (
                                                <button
                                                    className={styles.moveButton}
                                                    onClick={() => handleMoveToNextRound(candidate.id)}
                                                >
                                                    <ArrowUpRight size={16} />
                                                    Move to {candidate.nextRound}
                                                </button>
                                            )}
                                            <button
                                                className={styles.viewButton}
                                                onClick={() => onViewDetails(candidate)}
                                            >
                                                <Eye size={16} />
                                                View Details
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.detailGrid}>
                                        <div className={styles.detailItem}>
                                            <Mail size={14} className={styles.icon} />
                                            {candidate.email}
                                        </div>
                                        <div className={styles.detailItem}>
                                            <Phone size={14} className={styles.icon} />
                                            {candidate.phone}
                                        </div>
                                        <div className={styles.detailItem}>
                                            <Briefcase size={14} className={styles.icon} />
                                            {candidate.experience}
                                        </div>
                                        <div className={styles.detailItem}>
                                            <Calendar size={14} className={styles.icon} />
                                            Uploaded: {candidate.uploaded}
                                        </div>
                                        {candidate.scheduled && (
                                            <div className={styles.detailItem}>
                                                <Clock size={14} className={styles.icon} />
                                                Scheduled: {candidate.scheduled}
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.skillsRow}>
                                        <span className={styles.skillsLabel}>Skills:</span>
                                        <div className={styles.skillsList}>
                                            {candidate.skills.map((skill, i) => (
                                                <span key={i} className={styles.skillTag}>{skill}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {candidate.feedback && (
                                        <div className={styles.feedbackSection}>
                                            <div className={styles.feedbackLabel}>Interviewer Feedback:</div>
                                            <div className={styles.feedbackText}>{candidate.feedback}</div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div
                                style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}
                            >
                                No candidates match the selected filters.
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CandidateManagement;
