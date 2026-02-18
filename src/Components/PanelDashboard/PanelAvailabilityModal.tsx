import React from "react";
import "../Styles/PanelDashboard.css"; // Reuse dashboard styles or add new ones
import { FaTimes, FaUserTie, FaCheckCircle, FaClock, FaBan } from "react-icons/fa";

interface PanelAvailabilityModalProps {
    isOpen: boolean;
    onClose: () => void;
    driveName?: string;
}

const MOCK_PANELS = [
    { id: 1, name: "Panel Alpha", status: "Available", time: "Free Now" },
    { id: 2, name: "Panel Beta", status: "In Interview", time: "Busy until 4:00 PM" },
    { id: 3, name: "Panel Gamma", status: "Offline", time: "Unavailable" },
    { id: 4, name: "Panel Delta", status: "Available", time: "Free Now" },
];

const PanelAvailabilityModal: React.FC<PanelAvailabilityModalProps> = ({
    isOpen,
    onClose,
    driveName,
}) => {
    if (!isOpen) return null;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Available":
                return <FaCheckCircle className="status-icon available" />;
            case "In Interview":
                return <FaClock className="status-icon busy" />;
            default:
                return <FaBan className="status-icon offline" />;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case "Available": return "status-badge success";
            case "In Interview": return "status-badge warning";
            default: return "status-badge absent";
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content panel-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Other Panels - {driveName || "Current Drive"}</h3>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="panel-list">
                        {MOCK_PANELS.map((panel) => (
                            <div key={panel.id} className="panel-list-item">
                                <div className="panel-item-icon">
                                    <FaUserTie />
                                </div>
                                <div className="panel-item-info">
                                    <h4>{panel.name}</h4>
                                    <p>{panel.time}</p>
                                </div>
                                <div className={`panel-item-status ${getStatusClass(panel.status)}`}>
                                    {getStatusIcon(panel.status)} {panel.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="panel-btn-primary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PanelAvailabilityModal;
