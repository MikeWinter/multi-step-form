import React, { useId } from "react";
import { useField } from "formik";

import { ErrorText } from "./ErrorText";
import { Input } from "./Input";
import { LabelText } from "./LabelText";

interface TextFieldProps {
  name: string;
  children: React.ReactNode;
}

function TextField({ name, children }: TextFieldProps) {
  const id = useId();
  const [field, meta] = useField(name);

  return (
    <div>
      <LabelText htmlFor={id}>{children}</LabelText>
      <ErrorText error={meta.error} touched={meta.touched} />
      <Input id={id} {...field} />
    </div>
  );
}

export { TextField };
