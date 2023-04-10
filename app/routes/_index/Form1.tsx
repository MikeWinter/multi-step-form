import { Form, Formik } from "formik";
import * as Yup from "yup";

import { TextField } from "~/components/TextField";
import { useMultiStepForm } from "~/components/MultiStepForm";

const schema = Yup.object({
  "form-1-input": Yup.string().required(),
});

const defaultValues = {
  "form-1-input": "",
};

function Form1() {
  const { values, next } = useMultiStepForm();

  return (
    <Formik
      initialValues={{ ...defaultValues, ...values }}
      validationSchema={schema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={(values) => {
        next(values);
      }}
    >
      <Form>
        <TextField name="form-1-input">Field 1</TextField>

        <button type="submit">Next</button>
      </Form>
    </Formik>
  );
}

export { Form1 };
