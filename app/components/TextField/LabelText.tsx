import React, { memo } from "react";

interface LabelTextProps {
  htmlFor: string;
  children: React.ReactNode;
}

export const LabelText = memo(function LabelText({
  htmlFor,
  children,
}: LabelTextProps) {
  return (
    <div>
      <label htmlFor={htmlFor}>{children}</label>
    </div>
  );
});
