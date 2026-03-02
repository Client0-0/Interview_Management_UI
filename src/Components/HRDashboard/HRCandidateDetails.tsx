import React, { useState } from 'react';
import { Mail, Phone, Briefcase, Award, Download, Upload, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import styles from './HRCandidateDetails.module.css';

interface Candidate {
    id: number;
    name: string;
    role: string;
    email: string;
    phone: string;
    round: string;
    status: string;
    skills: string[];
    college?: string;
    experience?: string;
    uploaded?: string;
    scheduled?: string;
    feedback?: string | boolean;
    canMoveToNext?: boolean;
    nextRound?: string;
}

const HRCandidateDetails: React.FC = () => {
    const navigate = useNavigate();

    const raw = sessionStorage.getItem('hr_selected_candidate');
    const candidate: Candidate | null = raw ? JSON.parse(raw) : null;

    const initialStatus = candidate?.status
        ? candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)
        : 'Scheduled';

    const [currentStatus, setCurrentStatus] = useState(initialStatus);
    const [selectedStatus, setSelectedStatus] = useState(initialStatus);

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    if (!candidate) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                <p>No candidate selected.</p>
                <button onClick={() => navigate(-1)} style={{ marginTop: '1rem', cursor: 'pointer' }}>
                    ← Go Back
                </button>
            </div>
        );
    }

    const statusOptions = ['Pending', 'Scheduled', 'Selected', 'Rejected'];

    const handleStatusChange = (status: string) => { setSelectedStatus(status); };

    const handleUpdateStatus = () => {
        setCurrentStatus(selectedStatus);
        console.log(`Status updated to: ${selectedStatus}`);
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Pending': return styles.statusPending;
            case 'Scheduled': return styles.statusScheduled;
            case 'Selected': return styles.statusSelected;
            case 'Rejected': return styles.statusRejected;
            default: return '';
        }
    };

    const handleUploadClick = () => { fileInputRef.current?.click(); };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            console.log('Mock upload:', file.name);
        }
    };

    return (
        <div className={styles.container}>
            <Header
                title={candidate.name}
                subtitle={candidate.role}
            />

            <main className={styles.mainContent}>
                <div className={styles.contentGrid}>
                    {/* Left Column: Candidate Info */}
                    <div className={styles.infoCard}>
                        <div className={styles.profileHeader}>
                            <div>
                                <h2 className={styles.name}>{candidate.name}</h2>
                                <div className={styles.role}>{candidate.role}</div>
                            </div>
                            <div className={styles.badges}>
                                <span className={styles.roundBadge}>{candidate.round}</span>
                                <span className={`${styles.statusBadgeMain} ${getStatusClass(currentStatus)}`}>
                                    {currentStatus}
                                </span>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Contact Information</h3>
                            <div className={styles.contactGrid}>
                                <div className={styles.contactItem}>
                                    <Mail size={18} className={styles.icon} />
                                    <div>
                                        <div className={styles.label}>Email</div>
                                        <div className={styles.value}>{candidate.email}</div>
                                    </div>
                                </div>
                                <div className={styles.contactItem}>
                                    <Phone size={18} className={styles.icon} />
                                    <div>
                                        <div className={styles.label}>Phone</div>
                                        <div className={styles.value}>{candidate.phone}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Professional Details</h3>
                            <div className={styles.detailItem}>
                                <Briefcase size={18} className={styles.icon} />
                                <div>
                                    <div className={styles.label}>Position Applied</div>
                                    <div className={styles.value}>{candidate.role}</div>
                                </div>
                            </div>
                            <div className={styles.detailItem}>
                                <Award size={18} className={styles.icon} />
                                <div>
                                    <div className={styles.label}>Experience</div>
                                    <div className={styles.value}>{candidate.experience ?? 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Skills</h3>
                            <div className={styles.skillsList}>
                                {candidate.skills.map((skill, index) => (
                                    <span key={index} className={styles.skillTag}>{skill}</span>
                                ))}
                            </div>
                        </div>

                        {candidate.feedback && typeof candidate.feedback === 'string' && (
                            <div className={styles.section}>
                                <h3 className={styles.sectionTitle}>Interviewer Feedback</h3>
                                <div className={styles.feedbackBox}>{candidate.feedback}</div>
                            </div>
                        )}

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Resume</h3>
                            <div className={styles.resumeActions}>
                                <button className={styles.downloadButton}>
                                    <Download size={18} />
                                    Download Resume
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    accept=".pdf"
                                />
                                {uploadedFile ? (
                                    <div className={styles.uploadButton} style={{ borderColor: '#22c55e', color: '#16a34a', cursor: 'default' }}>
                                        <CheckCircle size={18} />
                                        {uploadedFile.name}
                                    </div>
                                ) : (
                                    <button className={styles.uploadButton} onClick={handleUploadClick}>
                                        <Upload size={18} />
                                        Upload New Resume (PDF)
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Update Status */}
                    <div className={styles.statusCard}>
                        <h3 className={styles.statusTitle}>Update Status</h3>
                        <div className={styles.statusList}>
                            {statusOptions.map((status) => {
                                const isSelected = selectedStatus === status;
                                const colorClass = getStatusClass(status);
                                return (
                                    <div
                                        key={status}
                                        className={`${styles.statusOption} ${colorClass} ${isSelected ? styles.statusOptionActive : ''}`}
                                        onClick={() => handleStatusChange(status)}
                                    >
                                        {status}
                                    </div>
                                );
                            })}
                        </div>

                        {selectedStatus !== currentStatus && (
                            <button className={styles.updateButton} onClick={handleUpdateStatus}>
                                Update Status
                            </button>
                        )}

                        <div className={styles.uploadedDate}>
                            <div className={styles.label}>Uploaded Date</div>
                            <div className={styles.dateValue}>{candidate.uploaded ?? '—'}</div>
                        </div>

                        {candidate.scheduled && (
                            <div className={styles.uploadedDate}>
                                <div className={styles.label}>Interview Date</div>
                                <div className={styles.dateValue}>{candidate.scheduled}</div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HRCandidateDetails;
