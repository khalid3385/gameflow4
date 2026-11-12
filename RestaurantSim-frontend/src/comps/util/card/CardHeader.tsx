import React from "react";

type HeaderSize = "sm" | "md" | "lg";
type HeaderAlign = "left" | "center";

type CardHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  size?: HeaderSize;
  align?: HeaderAlign;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

const sizeStyles: Record<HeaderSize, { title: string; description: string }> = {
  sm: {
    title: "text-base font-medium",
    description: "text-xs text-muted-text",
  },
  md: {
    title: "text-xl font-medium",
    description: "text-sm text-muted-text",
  },
  lg: {
    title: "text-3xl font-medium tracking-tight",
    description: "text-base text-muted-text",
  },
};

export const CardHeader = ({
  title,
  description,
  size = "md",
  align = "center",
  className = "",
  titleClassName = "",
  descriptionClassName = "",
}: CardHeaderProps) => {
  const alignClass = align === "center" ? "text-center" : "text-left";
  const currentSize = sizeStyles[size];

  return (
    <div className={`${alignClass} ${className}`}>
      <h2 className={`mb-1 ${currentSize.title} ${titleClassName}`}>
        {title}
      </h2>
      {description && (
        <p className={`${currentSize.description} ${descriptionClassName}`}>
          {description}
        </p>
      )}
    </div>
  );
};