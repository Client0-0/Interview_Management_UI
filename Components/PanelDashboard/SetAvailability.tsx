import React, { useState, useMemo } from "react";
import "../Styles/SetAvailability.css";
import Header from "../Header/Header";

interface SlotSelection {
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
}

interface DayAvailability {
  dayName: string;
  date: string;
  slots: SlotSelection;
  checked: boolean;
}

const SetAvailability: React.FC = () => {
  // ❇️ Generate next week only once using useMemo (NO WARNINGS)
  const nextWeekData: DayAvailability[] = useMemo(() => {
    const today = new Date();
    const nextWeekStart = new Date();

    // Move to next Monday
    nextWeekStart.setDate(today.getDate() + (8 - today.getDay()));

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const generated: DayAvailability[] = [];

    for (let i = 0; i < 7; i++) {
      const temp = new Date(nextWeekStart);
      temp.setDate(nextWeekStart.getDate() + i);

      generated.push({
        dayName: days[temp.getDay()],
        date: temp.toDateString().slice(4, 10),
        checked: false,
        slots: {
          morning: false,
          afternoon: false,
          evening: false,
        },
      });
    }

    return generated;
  }, []);

  const [weekData, setWeekData] = useState<DayAvailability[]>(nextWeekData);

  // Toggle main day checkbox
  const toggleDay = (index: number) => {
    const updated = [...weekData];
    updated[index].checked = !updated[index].checked;

    if (!updated[index].checked) {
      updated[index].slots = {
        morning: false,
        afternoon: false,
        evening: false,
      };
    }

    setWeekData(updated);
  };

  // Toggle slot (morning/afternoon/evening)
  const toggleSlot = (index: number, slot: keyof SlotSelection) => {
    const updated = [...weekData];
    updated[index].slots[slot] = !updated[index].slots[slot];
    setWeekData(updated);
  };

  return (
    <div className="availability-container">
      <Header />

      <div className="availability-box">
        <h3 className="section-title">📅 Next Week Availability</h3>
        <p className="section-subtitle">
          Select the days and time slots when you’re available for interviews next week.
        </p>

        {weekData.map((day, index) => (
          <div className="day-block" key={index}>
            <div className="day-header">
              <input
                type="checkbox"
                checked={day.checked}
                onChange={() => toggleDay(index)}
              />
              <label>
                {day.dayName} ({day.date})
              </label>
            </div>

            {day.checked && (
              <div className="slot-container">
                <div
                  className={`slot-box ${day.slots.morning ? "active" : ""}`}
                  onClick={() => toggleSlot(index, "morning")}
                >
                  Morning (9:00 AM - 12:00 PM)
                </div>

                <div
                  className={`slot-box ${day.slots.afternoon ? "active" : ""}`}
                  onClick={() => toggleSlot(index, "afternoon")}
                >
                  Afternoon (1:00 PM - 4:00 PM)
                </div>

                <div
                  className={`slot-box ${day.slots.evening ? "active" : ""}`}
                  onClick={() => toggleSlot(index, "evening")}
                >
                  Evening (4:00 PM - 7:00 PM)
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetAvailability;
