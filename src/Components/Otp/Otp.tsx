import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import "../Styles/Otp.css";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { notifyError, notifySuccess } from "../../Utils/toastHelper";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

const OtpScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email: string = (location.state as { email?: string })?.email ?? "";

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Countdown timer
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Input refs for auto-focus
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const startTimer = useCallback(() => {
    setSecondsLeft(RESEND_SECONDS);
    setCanResend(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startTimer();
    inputRefs.current[0]?.focus();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const handleChange = (value: string, index: number) => {
    const sanitized = value.replace(/\D/g, "").slice(-1);
    const updated = [...digits];
    updated[index] = sanitized;
    setDigits(updated);
    setError("");
    if (sanitized && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const updated = [...digits];
        updated[index] = "";
        setDigits(updated);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const updated = [...digits];
    pasted.split("").forEach((ch, i) => {
      if (i < OTP_LENGTH) updated[i] = ch;
    });
    setDigits(updated);
    const nextEmpty = updated.findIndex((d) => !d);
    const focusIndex = nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) {
      setError("Please enter all 6 digits.");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: wire up to real API — e.g. await verifyOtp({ email, otp })
      await new Promise((r) => setTimeout(r, 800)); // mock delay
      notifySuccess("OTP verified!");
      navigate("/set-new-password", { state: { email, otp } });
    } catch {
      notifyError("Invalid OTP. Please try again.");
      setError("The OTP you entered is incorrect.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      // TODO: wire up to real API — e.g. await forgotPassword(email)
      await new Promise((r) => setTimeout(r, 400)); // mock delay
      notifySuccess("OTP resent! Check your email.");
      setDigits(Array(OTP_LENGTH).fill(""));
      setError("");
      inputRefs.current[0]?.focus();
      startTimer();
    } catch {
      notifyError("Could not resend OTP. Try again.");
    }
  };

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_, a, _b, c) => a + "***" + c)
    : "your email";

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="otp-wrapper">
      <div className="otp-card">
        {/* Icon */}
        <div className="otp-icon-circle">
          <i className="fa-solid fa-message" />
        </div>

        <h2 className="otp-title">Check your inbox</h2>
        <p className="otp-subtitle">
          We sent a 6-digit code to <strong>{maskedEmail}</strong>. Enter it
          below to continue.
        </p>

        <form onSubmit={handleVerify} noValidate>
          {/* OTP digit boxes */}
          <div className="otp-boxes">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                id={`otp-box-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                className={`otp-box${digit ? " otp-box--filled" : ""}${error ? " otp-box--error" : ""}`}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
                autoComplete="one-time-code"
              />
            ))}
          </div>

          {error && <p className="otp-error">{error}</p>}

          {/* Timer / Resend */}
          <p className="otp-timer">
            {canResend ? (
              <button
                type="button"
                className="otp-resend-btn"
                onClick={handleResend}
              >
                <i className="fa-solid fa-rotate-right" /> Resend OTP
              </button>
            ) : (
              <>
                Resend code in{" "}
                <span className="otp-timer-countdown">
                  {pad(Math.floor(secondsLeft / 60))}:{pad(secondsLeft % 60)}
                </span>
              </>
            )}
          </p>

          <button
            type="submit"
            className={`otp-btn-submit${isLoading ? " otp-btn-loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="otp-spinner" /> Verifying…
              </>
            ) : (
              <>
                <i className="fa-solid fa-shield-check" /> Verify OTP
              </>
            )}
          </button>
        </form>

        <p className="otp-back-text">
          <Link to="/forgot-password">
            <i className="fa-solid fa-arrow-left" /> Back
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OtpScreen;
