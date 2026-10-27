type FormCard = {
  width?: string;
  height?: string;
  children: React.ReactNode;
};

const FormCard = ({ children = null, width = "", height = "" }: FormCard) => {
  return (
    <div
      className={`
   border-border-neutral-200-bg-white p-6 rounded-lg flex flex-col gap-2 ${width} ${height}`}
    >
      {children}
    </div>
  );
};

export default FormCard;

import React from "react";

export const FormHeader = ({
  title,
  description,
  marginBottom,
}: {
  title: string;
  description: string;
  marginBottom?: string;
}) => {
  return (
    <div
      style={{
        marginBottom: marginBottom,
      }}
      className="text-center"
    >
      <h2 className="text-4xl mb-2 font-medium">{title}</h2>
      <p className="opacity-70">
        {description}
      </p>
    </div>
  );
};
