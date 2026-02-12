import { useState } from "react";
import "./Styles/SettingsUI.css";
import AddPanelModal from "../AddDashBoardComponents/AddPanelModal";


export default function Assignments() {
    const [showAdd, setShowAdd] = useState(false);
      
  return (
    <section className="card wide">
          <div className="card-title">
            <div>
              <h2>Candidate & Panel Assignments</h2>
              <p className="muted">Assign candidates to panels and mentors for interviews</p>
            </div>
            
          </div>

          <div className="assign-table">
            <div className="table-header">
              <div>Candidate</div>
              <div>Panel Member</div>
              <div>Mentor</div>
              <div>Round</div>
              <div>Date & Time</div>
              <div>Status</div>
            </div>

            <div className="table-row">
              <div className="candidate-cell">
                <div className="bold">Alice Johnson</div>
                <div className="muted">alice@example.com</div>
              </div>
              <div>
                <div className="bold">Dr. Sarah Connor</div>
                <div className="muted">sarah.panel@company.com</div>
              </div>
              <div>
                <div className="bold">Michael Scott</div>
                <div className="muted">michael.mentor@company.com</div>
              </div>
              <div><span className="chip blue">Technical Round 1</span></div>
              <div>2024-12-15<br /><span className="muted">10:00 AM</span></div>
              <div><span className="chip outline">Scheduled</span></div>
            </div>

            <div className="table-row">
              <div className="candidate-cell">
                <div className="bold">Bob Smith</div>
                <div className="muted">bob@example.com</div>
              </div>
              <div>
                <div className="bold">John Reese</div>
                <div className="muted">john.panel@company.com</div>
              </div>
              <div>
                <div className="bold muted">Not assigned</div>
              </div>
              <div><span className="chip green">HR Round</span></div>
              <div>2024-12-10<br /><span className="muted">2:00 PM</span></div>
              <div><span className="chip green">Completed</span></div>
            </div>
          </div>
          {showAdd && <AddPanelModal onClose={() => setShowAdd(false)} />}
            
        </section>

  );
}
