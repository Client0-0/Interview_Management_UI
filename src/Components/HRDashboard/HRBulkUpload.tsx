import React, { useState, useRef } from 'react';
import { Upload, FileIcon, Brain, X, Loader2, FileText, AlignLeft } from 'lucide-react';
import Header from './Header';
import styles from './HRBulkUpload.module.css';

const HRBulkUpload: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [jdText, setJdText] = useState('');
    const [jdMode, setJdMode] = useState<'text' | 'file'>('text');
    const [jdFile, setJdFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const jdFileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const allowedTypes = [
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            const newFiles = Array.from(files).filter(f =>
                allowedTypes.includes(f.type) ||
                f.name.endsWith('.pdf') ||
                f.name.endsWith('.docx') ||
                f.name.endsWith('.xlsx') ||
                f.name.endsWith('.xls')
            );
            setSelectedFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleBrowseClick = () => { fileInputRef.current?.click(); };

    const handleJdFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setJdFile(file);
        const reader = new FileReader();
        reader.onload = (e) => { setJdText(e.target?.result as string ?? ''); };
        reader.readAsText(file);
    };

    const handleJdDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        setJdFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => { setJdText(ev.target?.result as string ?? ''); };
        reader.readAsText(file);
    };

    const handleShortlist = async () => {
        if (selectedFiles.length === 0 || !jdText.trim()) {
            setError('Please upload resumes and provide a job description.');
            return;
        }
        setIsProcessing(true);
        setError(null);
        // setResults(null);

        const formData = new FormData();
        selectedFiles.forEach(file => { formData.append('resumes', file); });
        formData.append('jd', jdText);

        try {
            const response = await fetch('http://localhost:5031/api/shortlist', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to process resumes.');
            }
            // const data = await response.json();
            // setResults(data);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className={styles.container}>
            <Header
                title="Bulk Upload"
                subtitle="Upload candidate resumes"
            />

            <main className={styles.mainContent}>
                <div className={styles.uploadCard}>
                    {/* JD Section */}
                    <div className={styles.jdSection}>
                        <div className={styles.jdHeader}>
                            <h3 className={styles.sectionTitle}>1. Job Description</h3>
                            <div className={styles.jdTabs}>
                                <button
                                    className={`${styles.jdTab} ${jdMode === 'text' ? styles.jdTabActive : ''}`}
                                    onClick={() => { setJdMode('text'); setJdFile(null); }}
                                >
                                    <AlignLeft size={14} /> Paste Text
                                </button>
                                <button
                                    className={`${styles.jdTab} ${jdMode === 'file' ? styles.jdTabActive : ''}`}
                                    onClick={() => setJdMode('file')}
                                >
                                    <FileText size={14} /> Upload File
                                </button>
                            </div>
                        </div>

                        {jdMode === 'text' ? (
                            <textarea
                                id="jobDescription"
                                name="jobDescription"
                                className={styles.jdTextArea}
                                placeholder="Paste the Job Description here..."
                                value={jdText}
                                onChange={(e) => setJdText(e.target.value)}
                            />
                        ) : (
                            <div
                                className={styles.jdDropZone}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleJdDrop}
                            >
                                <input
                                    type="file"
                                    ref={jdFileInputRef}
                                    className={styles.hiddenInput}
                                    accept=".txt,.pdf,.docx"
                                    onChange={handleJdFileUpload}
                                />
                                {jdFile ? (
                                    <div className={styles.jdFilePreview}>
                                        <FileText size={22} className={styles.jdFileIcon} />
                                        <span className={styles.jdFileName}>{jdFile.name}</span>
                                        <button className={styles.removeFile} onClick={() => { setJdFile(null); setJdText(''); }}>
                                            <X size={15} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <FileText size={28} strokeWidth={1.5} color="#6366f1" />
                                        <p className={styles.jdDropText}>Drag &amp; drop your JD file here</p>
                                        <p className={styles.jdDropSub}>Supports .txt, .pdf, .docx</p>
                                        <button className={styles.browseButton} onClick={() => jdFileInputRef.current?.click()}>
                                            Browse File
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Upload Section */}
                    <div className={styles.uploadSection}>
                        <h3 className={styles.sectionTitle}>2. Upload Resumes (PDF / DOCX / Excel)</h3>
                        <div className={styles.uploadArea}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className={styles.hiddenInput}
                                accept=".pdf,.docx,.xlsx,.xls"
                                multiple
                            />
                            <div className={styles.emptyState}>
                                <div className={styles.uploadIconWrapper}>
                                    <Upload size={32} strokeWidth={1.5} color="#6366f1" />
                                </div>
                                <p className={styles.dragText}>Drag &amp; drop PDF/DOCX resumes or Excel candidates list</p>
                                <button className={styles.browseButton} onClick={handleBrowseClick}>
                                    Browse Files
                                </button>
                            </div>
                        </div>

                        {selectedFiles.length > 0 && (
                            <div className={styles.fileList}>
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className={styles.fileItem}>
                                        <FileIcon size={20} className={styles.fileIcon} />
                                        <span className={styles.fileName}>{file.name}</span>
                                        <button className={styles.removeFile} onClick={() => removeFile(index)}>
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <div className={styles.actions}>
                        <button
                            className={styles.shortlistButton}
                            onClick={handleShortlist}
                            disabled={isProcessing || selectedFiles.length === 0 || !jdText.trim()}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className={styles.spinning} size={20} />
                                    Processing with AI...
                                </>
                            ) : (
                                <>
                                    <Brain size={20} />
                                    Run AI Shortlister
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* {results && <ShortlistResultsTable results={results} />} */}
            </main>
        </div>
    );
};

export default HRBulkUpload;
