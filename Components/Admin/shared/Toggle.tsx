export default function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      className={`toggle ${on ? "on" : ""}`}
      onClick={onToggle}
      aria-pressed={on}
      type="button"
    >
      <span className="knob" />
    </button>
  );
}
