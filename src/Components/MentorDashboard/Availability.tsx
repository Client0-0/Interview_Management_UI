import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import "../Styles/Availability.css";
// import { setAvailabilityForUser } from "../../Services/User.Service";

interface DayItem {
    iso: string;
    dayName: string;
    formattedDate: string;
}

const Availability = () => {
    const navigate = useNavigate();
    const [selectedDates, setSelectedDates] = useState<string[]>([]);

    const closeOverlay = () => {
        navigate(-1);
    };

    const getNextMonday = (): Date => {
        const today = new Date();
        const day = today.getDay();
        const daysUntilNextMonday = day === 1 ? 7 : (8 - day) % 7;
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + daysUntilNextMonday);
        return nextMonday;
    };

    const weekDays: DayItem[] = useMemo(() => {
        const start = getNextMonday();

        return Array.from({ length: 7 }).map((_, index) => {
            const current = new Date(start);
            current.setDate(start.getDate() + index);

            return {
                iso: current.toISOString(),
                dayName: current.toLocaleDateString("en-US", {
                    weekday: "long",
                }),
                formattedDate: current.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }),
            };
        });
    }, []);

    const toggleDate = (iso: string) => {
        setSelectedDates((prev) =>
            prev.includes(iso)
                ? prev.filter((d) => d !== iso)
                : [...prev, iso]
        );
    };

    const handleSave = async () => {
        // 🔇 Backend call commented out — uncomment when service is ready
        // try {
        //   const userId = Number(localStorage.getItem("userId"));
        //   if (!userId) { alert("User not found"); return; }
        //   await setAvailabilityForUser({ userId, dates: selectedDates });
        //   alert("Availability saved successfully");
        //   closeOverlay();
        // } catch (error) {
        //   console.error(error);
        //   alert("Something went wrong");
        // }

        /* 🟢 MOCK: just close overlay */
        console.log("Selected dates:", selectedDates);
        closeOverlay();
    };

    return (
        <div className="avail-overlay-backdrop" onClick={closeOverlay}>
            <div
                className="avail-overlay-container"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="avail-overlay-header">
                    <div>
                        <h2>Select Availability</h2>
                        <p>Choose the days you're available next week</p>
                    </div>
                    <button className="avail-close-btn" onClick={closeOverlay}>
                        <i className="fa-solid fa-xmark" />
                    </button>
                </div>

                <div className="avail-days-wrapper">
                    {weekDays.map((day) => (
                        <div
                            key={day.iso}
                            className={`avail-day-card ${selectedDates.includes(day.iso) ? "selected" : ""
                                }`}
                            onClick={() => toggleDate(day.iso)}
                        >
                            <div className="avail-day-check">
                                {selectedDates.includes(day.iso) ? (
                                    <i className="fa-solid fa-circle-check" />
                                ) : (
                                    <i className="fa-regular fa-circle" />
                                )}
                            </div>
                            <p className="avail-day-name">{day.dayName}</p>
                            <p className="avail-day-date">{day.formattedDate}</p>
                        </div>
                    ))}
                </div>

                <div className="avail-overlay-footer">
                    <span className="avail-selected-count">
                        {selectedDates.length} day{selectedDates.length !== 1 ? "s" : ""} selected
                    </span>
                    <div className="avail-footer-btns">
                        <button className="avail-cancel-btn" onClick={closeOverlay}>
                            Cancel
                        </button>
                        <button
                            className="avail-save-btn"
                            onClick={handleSave}
                            disabled={selectedDates.length === 0}
                        >
                            <i className="fa-solid fa-check" /> Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Availability;
