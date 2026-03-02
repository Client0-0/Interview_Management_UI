import React, { useState } from 'react';
import { Download, CloudUpload, X, Briefcase, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import styles from './ShortlistResultsTable.module.css';

export interface CandidateResult {
    filename: string;
    yearsOfExperience: string;
    missingSkills: string[];
    matchScore: number;
    briefReasoning: string;
    decision: string;
    distance: number;
}

interface ShortlistResultsTableProps {
    results: CandidateResult[];
}

const ShortlistResultsTable: React.FC<ShortlistResultsTableProps> = ({ results }) => {
    const [selectedCandidate, setSelectedCandidate] = useState<CandidateResult | null>(null);

    const getDecisionColor = (decision: string) => {
        const d = decision?.toLowerCase() || '';
        if (d === 'yes') return '#16a34a';
        if (d === 'no') return '#dc2626';
        return '#d97706';
    };

    const buildPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Shortlisted Candidates Results', 14, 22);
        autoTable(doc, {
            head: [["Candidate", "Decision", "Experience", "Missing Skills", "Reasoning"]],
            body: results.map(r => [
                r.filename,
                r.decision || 'N/A',
                r.yearsOfExperience,
                (r.missingSkills || []).join(', '),
                r.briefReasoning
            ]),
            startY: 30,
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: [99, 102, 241], textColor: 255 },
        });
        return doc;
    };

    const handleDownloadPDF = () => buildPDF().save('shortlist_results.pdf');

    const handleUploadToAzure = async () => {
        const pdfBlob = buildPDF().output('blob');
        const formData = new FormData();
        formData.append('file', new File([pdfBlob], 'shortlist_results.pdf', { type: 'application/pdf' }));
        try {
            const res = await fetch('http://localhost:5031/api/upload-report', { method: 'POST', body: formData });
            alert(res.ok ? 'Uploaded to Azure successfully!' : `Upload failed: ${await res.text()}`);
        } catch (err) {
            console.error('Upload error:', err);
            alert('Error uploading to Azure.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Shortlisted Candidates</h3>
                <div className={styles.actions}>
                    <button onClick={handleDownloadPDF} className={styles.downloadBtn}>
                        <Download size={16} /> Download PDF
                    </button>
                    <button onClick={handleUploadToAzure} className={`${styles.downloadBtn} ${styles.azureBtn}`}>
                        <CloudUpload size={16} /> Upload to Azure
                    </button>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Candidate / Filename</th>
                            <th>Decision</th>
                            <th>Experience</th>
                            <th>Missing Skills</th>
                            <th>Reasoning</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr key={index} className={styles.tableRow} onClick={() => setSelectedCandidate(result)}>
                                <td className={styles.filename}>{result.filename}</td>
                                <td>
                                    <span className={styles.decisionTag} style={{
                                        backgroundColor: `${getDecisionColor(result.decision)}20`,
                                        color: getDecisionColor(result.decision),
                                        border: `1px solid ${getDecisionColor(result.decision)}40`,
                                    }}>
                                        {result.decision || 'N/A'}
                                    </span>
                                </td>
                                <td>{result.yearsOfExperience}</td>
                                <td>
                                    <div className={styles.skillsList}>
                                        {(result.missingSkills || []).map((skill, i) => (
                                            <span key={i} className={styles.skillTag}>{skill}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className={styles.reasoning}>{result.briefReasoning}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedCandidate && (
                <div className={styles.modalOverlay} onClick={() => setSelectedCandidate(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalHeaderLeft}>
                                <div className={styles.modalIconBg}>
                                    <FileText size={22} className={styles.modalIcon} />
                                </div>
                                <div>
                                    <h2 className={styles.modalTitle}>{selectedCandidate.filename}</h2>
                                    <span className={styles.decisionTag} style={{
                                        backgroundColor: `${getDecisionColor(selectedCandidate.decision)}20`,
                                        color: getDecisionColor(selectedCandidate.decision),
                                        border: `1px solid ${getDecisionColor(selectedCandidate.decision)}40`,
                                    }}>
                                        Decision: {selectedCandidate.decision || 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <button className={styles.closeModalBtn} onClick={() => setSelectedCandidate(null)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.modalSection}>
                                <h4 className={styles.sectionHeading}><Briefcase size={15} /> Experience</h4>
                                <p className={styles.sectionText}>{selectedCandidate.yearsOfExperience}</p>
                            </div>
                            <div className={styles.modalSection}>
                                <h4 className={styles.sectionHeading}>Missing Skills</h4>
                                <div className={styles.skillsList}>
                                    {selectedCandidate.missingSkills?.length > 0
                                        ? selectedCandidate.missingSkills.map((skill, i) => (
                                            <span key={i} className={`${styles.skillTag} ${styles.missingSkillTag}`}>{skill}</span>
                                        ))
                                        : <span className={styles.noMissingSkills}>None identified</span>
                                    }
                                </div>
                            </div>
                            <div className={styles.modalSection}>
                                <h4 className={styles.sectionHeading}>Reasoning</h4>
                                <p className={styles.reasoningText}>{selectedCandidate.briefReasoning}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShortlistResultsTable;
