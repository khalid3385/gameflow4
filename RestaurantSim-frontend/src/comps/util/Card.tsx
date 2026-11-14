type Card = {
  width?: string;
  height?: string;
  children: React.ReactNode;
  className?: string
};

const Card = ({ children = null, width = "", height = "", className }: Card) => {
  return (
    <div
      className={`
   border border-context-border bg-surface p-6 rounded-xl overflow-clip flex flex-col gap-2 ${width} ${height} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;

import React from "react";

export const CardHeader = ({
  title,
  description,
  marginBottom,
  className
}: {
  title: string;
  description?: string;
  marginBottom?: string;
  className?: string

}) => {
  return (
    <div
      style={{
        marginBottom: marginBottom,
      }}
      className={"text-center " + className}
    >
      <h2 className="text-xl mb-1 font-medium">{title}</h2>
      <p className="opacity-70">
        {description}
      </p>
    </div>
  );
};
