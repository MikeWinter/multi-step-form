import { useContext } from "react";

import { MultiStepForm } from "./MultiStepForm";
import { MultiStepFormContext } from "./MultiStepFormContext";

function useMultiStepForm() {
  const context = useContext(MultiStepFormContext);

  if (context === null) {
    throw new Error(
      `${useMultiStepForm.name}() must be used within a ${MultiStepForm.name}`
    );
  }

  return {
    step: context.step,
    values: context.values[context.step],
    allValues: context.values,
    next: context.onNext,
    previous: context.onPrevious,
  };
}

export { useMultiStepForm };
