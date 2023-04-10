import React, { memo } from "react";

interface ErrorTextProps {
  error?: string;
  touched: boolean;
}

export const ErrorText = memo(function ErrorText({
  error,
  touched,
}: ErrorTextProps) {
  return touched && error ? <div>{error}</div> : null;
});
