import type { V2_MetaFunction } from "@remix-run/node";

import { MultiStepForm } from "~/components/MultiStepForm";

import { Form1 } from "./Form1";
import { Form2 } from "./Form2";
import { Summary } from "./Summary";

const titlePrefixes = {
  0: "Form1",
  1: "Form2",
  2: "Summary",
};

export const meta: V2_MetaFunction = ({ location: { state } }) => {
  const step: keyof typeof titlePrefixes | undefined = state?.step;
  const prefix = titlePrefixes[step ?? 0];
  return [{ title: `${prefix} | New Remix App` }];
};

// const steps = { foo: <Form1 />, bar: <Form2 /> };
const steps = [
  <Form1 key="step1" />,
  <Form2 key="step2" />,
  <Summary key="step3" />,
];

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>

      <MultiStepForm
        initialStep={0}
        // initialStep={"foo"}
        initialValues={[undefined, { "form-2-input": "value" }]}
        // initialValues={{ bar: { "form-2-input": "value" } }}
        steps={steps}
        // onNext={(step) => step + 1}
        // onPrevious={(step) => step - 1}
        // useSteps={useStateSteps}
      />
    </div>
  );
}
