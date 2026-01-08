import { useState, useEffect, useCallback, useRef } from "react";
import "../styles/productTour.css";

// ============================================
// DEFAULT TOUR STEPS - Sesuaikan dengan elemen di website kamu
// ============================================
const defaultTourSteps = [
  {
    id: "navbar",
    selector: ".navbar",
    title: "🧭 Navigasi Utama",
    description:
      "Ini adalah navbar utama. Di sini kamu bisa mengakses semua menu website seperti Home, Peta, Visualisasi, Insight, dan halaman lainnya.",
    position: "bottom",
  },
  {
    id: "navbar-logo",
    selector: ".navbar-logo",
    title: "🏠 Logo ProyekSIG",
    description: "Klik logo ini kapanpun untuk kembali ke halaman utama.",
    position: "bottom",
  },
  {
    id: "navbar-menu",
    selector: ".navbar-menu",
    title: "📋 Menu Navigasi",
    description:
      "Menu lengkap untuk menjelajahi website: Peta, Visualisasi, Insight, Contact, dan Dataset.",
    position: "bottom",
  },
  {
    id: "hero-content",
    selector: ".hero-content",
    title: "🌿 Selamat Datang!",
    description:
      "Hero section menampilkan informasi utama tentang proyek analisis vegetasi perkotaan berbasis Sistem Informasi Geografis.",
    position: "bottom",
  },
  {
    id: "hero-button",
    selector: ".hero-button",
    title: "🗺️ Eksplorasi Peta",
    description:
      "Klik tombol ini untuk masuk ke halaman peta interaktif dan menjelajahi data pohon peneduh.",
    position: "bottom",
  },
  {
    id: "home-cta",
    selector: ".home-cta",
    title: "⚡ Tombol Aksi",
    description:
      "Tombol-tombol ini tersebar di website untuk navigasi cepat ke halaman yang relevan.",
    position: "top",
  },
  {
    id: "chatbot",
    selector: ".chatbot-toggle",
    title: "💬 Asisten Virtual",
    description:
      "Butuh bantuan? Klik icon chat untuk membuka chatbot yang siap menjawab pertanyaanmu!",
    position: "left",
  },
];

// ============================================
// PRODUCT TOUR COMPONENT
// ============================================
export default function ProductTour({
  steps = defaultTourSteps,
  storageKey = "productTourCompleted",
  onComplete,
  onSkip,
  autoStart = true,
}) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const tooltipRef = useRef(null);
  const PADDING = 10;

  // Check if tour has been completed
  const hasCompletedTour = useCallback(() => {
    try {
      return localStorage.getItem(storageKey) === "true";
    } catch {
      return false;
    }
  }, [storageKey]);

  // Mark tour as completed
  const markTourCompleted = useCallback(() => {
    try {
      localStorage.setItem(storageKey, "true");
    } catch (e) {
      console.warn("Could not save tour status:", e);
    }
  }, [storageKey]);

  // Start tour
  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
    setIsAnimating(true);
    document.body.style.overflow = "hidden";
  }, []);

  // End tour
  const endTour = useCallback(
    (completed = false) => {
      setIsActive(false);
      setIsAnimating(false);
      setTargetRect(null);
      document.body.style.overflow = "";
      markTourCompleted();

      if (completed) {
        onComplete?.();
      } else {
        onSkip?.();
      }
    },
    [markTourCompleted, onComplete, onSkip]
  );

  // Navigation
  const handleNext = () => {
    setIsAnimating(true);
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      endTour(true);
    }
  };

  const handleBack = () => {
    setIsAnimating(true);
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => endTour(false);

  const goToStep = (index) => {
    if (index >= 0 && index < steps.length) {
      setIsAnimating(true);
      setCurrentStep(index);
    }
  };

  // Calculate tooltip position
  const calculateTooltipPosition = useCallback((rect, position) => {
    if (!rect || !tooltipRef.current) return {};

    const tooltip = tooltipRef.current.getBoundingClientRect();
    const gap = 20;
    const margin = 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top, left;

    switch (position) {
      case "top":
        top = rect.top - PADDING - tooltip.height - gap;
        left = rect.left + rect.width / 2 - tooltip.width / 2;
        break;
      case "bottom":
        top = rect.bottom + PADDING + gap;
        left = rect.left + rect.width / 2 - tooltip.width / 2;
        break;
      case "left":
        top = rect.top + rect.height / 2 - tooltip.height / 2;
        left = rect.left - PADDING - tooltip.width - gap;
        break;
      case "right":
        top = rect.top + rect.height / 2 - tooltip.height / 2;
        left = rect.right + PADDING + gap;
        break;
      default:
        top = rect.bottom + PADDING + gap;
        left = rect.left + rect.width / 2 - tooltip.width / 2;
    }

    // Boundary checks
    if (left < margin) left = margin;
    if (left + tooltip.width > viewportWidth - margin) {
      left = viewportWidth - tooltip.width - margin;
    }
    if (top < margin) top = rect.bottom + PADDING + gap;
    if (top + tooltip.height > viewportHeight - margin) {
      top = viewportHeight - tooltip.height - margin;
    }

    return { top, left };
  }, []);

  // Update target element
  useEffect(() => {
    if (!isActive || !steps[currentStep]) return;

    const step = steps[currentStep];
    const element = document.querySelector(step.selector);

    if (!element) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
      return;
    }

    // Scroll into view
    element.scrollIntoView({ behavior: "smooth", block: "center" });

    // Update positions after scroll
    const timer = setTimeout(() => {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
      setTooltipStyle(calculateTooltipPosition(rect, step.position));
    }, 350);

    return () => clearTimeout(timer);
  }, [isActive, currentStep, steps, calculateTooltipPosition]);

  // Keyboard navigation
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowRight":
        case "Enter":
          handleNext();
          break;
        case "ArrowLeft":
          handleBack();
          break;
        case "Escape":
          handleSkip();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, currentStep]);

  // Window resize handler
  useEffect(() => {
    if (!isActive) return;

    const handleResize = () => {
      const step = steps[currentStep];
      const element = document.querySelector(step?.selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        setTooltipStyle(calculateTooltipPosition(rect, step.position));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isActive, currentStep, steps, calculateTooltipPosition]);

  // Auto-start on first visit
  useEffect(() => {
    if (autoStart && !hasCompletedTour()) {
      const timer = setTimeout(startTour, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoStart, hasCompletedTour, startTour]);

  if (!isActive) return null;

  const step = steps[currentStep];
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Calculate overlay pieces (4 rectangles to create hole)
  const getOverlayStyles = () => {
    if (!targetRect) {
      return {
        top: { top: 0, left: 0, width: "100%", height: "100%" },
        bottom: { display: "none" },
        left: { display: "none" },
        right: { display: "none" },
      };
    }

    const holeTop = Math.max(0, targetRect.top - PADDING);
    const holeLeft = Math.max(0, targetRect.left - PADDING);
    const holeRight = Math.min(viewportWidth, targetRect.right + PADDING);
    const holeBottom = Math.min(viewportHeight, targetRect.bottom + PADDING);

    return {
      top: {
        top: 0,
        left: 0,
        width: "100%",
        height: holeTop,
      },
      bottom: {
        top: holeBottom,
        left: 0,
        width: "100%",
        height: viewportHeight - holeBottom,
      },
      left: {
        top: holeTop,
        left: 0,
        width: holeLeft,
        height: holeBottom - holeTop,
      },
      right: {
        top: holeTop,
        left: holeRight,
        width: viewportWidth - holeRight,
        height: holeBottom - holeTop,
      },
    };
  };

  const overlayStyles = getOverlayStyles();

  return (
    <div className="product-tour">
      {/* Overlay dengan 4 bagian untuk membuat lubang */}
      <div className="tour-overlay">
        <div className="tour-overlay-piece" style={overlayStyles.top} />
        <div className="tour-overlay-piece" style={overlayStyles.bottom} />
        <div className="tour-overlay-piece" style={overlayStyles.left} />
        <div className="tour-overlay-piece" style={overlayStyles.right} />
      </div>

      {/* Spotlight glow border */}
      {targetRect && (
        <div
          className="tour-spotlight"
          style={{
            top: targetRect.top - PADDING,
            left: targetRect.left - PADDING,
            width: targetRect.width + PADDING * 2,
            height: targetRect.height + PADDING * 2,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={`tour-tooltip ${
          isAnimating ? "tour-tooltip-animate" : ""
        } tour-tooltip-${step?.position || "bottom"}`}
        style={tooltipStyle}
        onAnimationEnd={() => setIsAnimating(false)}
      >
        {/* Progress */}
        <div className="tour-progress">
          <div className="tour-progress-dots">
            {steps.map((_, index) => (
              <span
                key={index}
                className={`tour-progress-dot ${
                  index === currentStep ? "active" : ""
                } ${index < currentStep ? "completed" : ""}`}
                onClick={() => goToStep(index)}
              />
            ))}
          </div>
          <span className="tour-progress-text">
            {currentStep + 1} / {steps.length}
          </span>
        </div>

        {/* Content */}
        <div className="tour-content">
          <h3 className="tour-title">{step?.title}</h3>
          <p className="tour-description">{step?.description}</p>
        </div>

        {/* Navigation */}
        <div className="tour-navigation">
          <button className="tour-btn tour-btn-skip" onClick={handleSkip}>
            Lewati
          </button>

          <div className="tour-btn-group">
            <button
              className="tour-btn tour-btn-back"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Kembali
            </button>

            <button className="tour-btn tour-btn-next" onClick={handleNext}>
              {currentStep === steps.length - 1 ? "Selesai" : "Lanjut"}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Keyboard hints */}
        <div className="tour-keyboard-hint">
          <span>← → Navigasi</span>
          <span>Enter Lanjut</span>
          <span>Esc Lewati</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HOOK untuk mengontrol tour dari luar
// ============================================
export const useTour = (storageKey = "productTourCompleted") => {
  const resetTour = () => {
    try {
      localStorage.removeItem(storageKey);
      window.location.reload();
    } catch (e) {
      console.warn("Could not reset tour:", e);
    }
  };

  const hasSeenTour = () => {
    try {
      return localStorage.getItem(storageKey) === "true";
    } catch {
      return false;
    }
  };

  return { resetTour, hasSeenTour };
};

// ============================================
// TOMBOL TRIGGER untuk restart tour
// ============================================
export function TourTriggerButton({ onClick, className = "" }) {
  return (
    <button
      className={`tour-trigger-btn ${className}`}
      onClick={onClick}
      title="Mulai Product Tour"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
      <span>Tour</span>
    </button>
  );
}
