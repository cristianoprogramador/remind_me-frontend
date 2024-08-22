import React, { useState } from "react";
import { twJoin } from "tailwind-merge";

interface ToolTipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

const BASE_CLASSES = `absolute bg-slate-800 border border-slate-500 rounded-md p-2 z-10 text-white opacity-0 transition-opacity duration-200 ease-in-out text-center w-44 break-words`;

const HOVER_CLASSES = `opacity-100`;

export function ToolTip({ content, children, className }: ToolTipProps) {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const tooltipClasses = twJoin(
    BASE_CLASSES,
    hovered ? HOVER_CLASSES : "",
    className
  );

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {hovered && (
        <div
          className={tooltipClasses}
          style={{
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: "8px",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
