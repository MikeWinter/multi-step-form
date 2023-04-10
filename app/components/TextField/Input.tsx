import type { HTMLInputTypeAttribute } from "react";
import React, { memo } from "react";

import type { FieldInputProps } from "formik";

interface TextBoxProps extends FieldInputProps<HTMLInputTypeAttribute> {
  id: string;
}

export const Input = memo(function Input({ id, ...rest }: TextBoxProps) {
  return (
    <div>
      <input id={id} {...rest} />
    </div>
  );
});
