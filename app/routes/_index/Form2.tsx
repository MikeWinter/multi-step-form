import { Form, Formik } from "formik";
import * as Yup from "yup";

import { TextField } from "~/components/TextField";
import { useMultiStepForm } from "~/components/MultiStepForm";

const schema = Yup.object({
  "form-2-input": Yup.string().required(),
});

const defaultValues = {
  "form-2-input": "",
};

function Form2() {
  const { values, next, previous } = useMultiStepForm();

  return (
    <Formik
      initialValues={{ ...defaultValues, ...values }}
      validationSchema={schema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={(values) => next(values)}
    >
      <Form>
        <TextField name="form-2-input">Field 2</TextField>

        <button type="submit">Next</button>
        <button type="button" onClick={() => previous()}>
          Previous
        </button>
      </Form>
    </Formik>
  );
}

export { Form2 };
