"use client";

import { TearEntry } from "@/lib/types";
import { format } from "date-fns";

interface TearTooltipProps {
  entry: TearEntry | null;
  x: number;
  y: number;
  vw: number;
  isDate?: boolean;
}

const MOOD_COLOR = { sad: "#7399d0", touched: "#C8A36A", unsure: "#9e9fa1ff" };
const MOBILE_MAX = 180;
const DESKTOP_MAX = 320;

function getTooltipWidth(vw: number) {
  if (!vw) return 240;
  if (vw < 480) return Math.min(MOBILE_MAX, vw * 0.7);
  if (vw < 900) return Math.min(260, vw * 0.5);
  return DESKTOP_MAX;
}

export default function TearTooltip({
  entry,
  x,
  y,
  vw,
  isDate,
}: TearTooltipProps) {
  if (!entry) return null;

  const tooltipW = getTooltipWidth(vw);
  const flipLeft = vw > 0 && x + 16 + tooltipW > vw;

  return (
    <div
      style={{
        position: "fixed",
        left: flipLeft ? x - tooltipW - 16 : x + 16,
        top: y - 16,
        transform: isDate ? "translateY(-100%)" : undefined,
        pointerEvents: "none",
        background: "var(--card-bg)",
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.06)",
        maxWidth: tooltipW,
        padding: "10px 14px",
        zIndex: 1000,
      }}
    >
      {/* Date + nickname */}
      <div style={{ marginBottom: 6 }}>
        <div
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 12,
            fontWeight: 300,
            letterSpacing: "0.12em",
            color: "rgba(246,245,242,0.7)",
          }}
        >
          {format(
            new Date(entry.date + "T00:00:00"),
            "MMM d, yyyy",
          ).toLowerCase()}
        </div>
      </div>

      {/* Mood dot + label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 6,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            background: MOOD_COLOR[entry.mood],
            borderRadius: "50%",
            opacity: 0.82,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 12,
            fontWeight: 300,
            letterSpacing: "0.10em",
            color: "rgba(246,245,242,0.7)",
          }}
        >
          {entry.mood}
        </span>
      </div>

      {entry.nickname && (
        <div
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 11,
            fontWeight: 300,
            letterSpacing: "0.14em",
            color: "rgba(246,245,242,0.45)",
            margin: 2,
            marginLeft: 0,
          }}
        >
          by {entry.nickname}
        </div>
      )}

      {/* Note */}
      {entry.note && (
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 16,
            lineHeight: 1.7,
            color: "rgba(246,245,242,0.95)",
            marginBottom: 8,
          }}
        >
          {entry.note}
        </div>
      )}

      {/* Intensity */}
      <button
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: 12,
          fontWeight: 300,
          letterSpacing: "0.06em",
          color: "rgba(246,245,242,0.7)",
          border: "1px solid rgba(246,245,242,0.5)",
          padding: "3px 8px",
          background: "transparent",
          cursor: "default",
        }}
      >
        {entry.intensity}
      </button>
    </div>
  );
}
