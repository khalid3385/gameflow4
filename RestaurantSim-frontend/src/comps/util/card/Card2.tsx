import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export const Card2 = ({ children, className = "", ...props }: CardProps) => {
  return (
    <div
      className={`border-border-context-border-bg-surface 
        rounded-xl overflow-clip flex flex-col ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardBody = ({ children, className = "", ...props }: CardProps) => {
  return (
    <div className={`p-6 flex flex-col gap-3 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = "", ...props }: CardProps) => {
  return (
    <div
      className={`bg-surface-darker px-6 py-4 border-t border-context-border flex items-center ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};