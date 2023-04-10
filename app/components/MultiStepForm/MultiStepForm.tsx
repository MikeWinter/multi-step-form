import React, { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import type { Values } from "./MultiStepFormContext";
import { MultiStepFormContext } from "./MultiStepFormContext";

type Steps =
  | { [key: number]: React.ReactElement }
  | { [key: string]: React.ReactElement };
type StepIndex<T> = T extends React.ReactElement[] ? number : keyof T;
type StepState<T> = {
  currentStep: T;
  setCurrentStep: (step: T) => void;
};
type UseSteps<T> = (initialStep: T) => StepState<T>;

function useRouterSteps<T, I = StepIndex<T>>(initialStep: I): StepState<I> {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const currentStep = state?.step ?? initialStep;

  return {
    currentStep,
    setCurrentStep: useCallback(
      (step: typeof initialStep) => {
        navigate(pathname, {
          state: { step },
        });
      },
      [navigate, pathname]
    ),
  };
}

function useStateSteps<T, I = StepIndex<T>>(initialStep: I): StepState<I> {
  const [currentStep, setCurrentStep] = useState(initialStep);

  return {
    currentStep,
    setCurrentStep,
  };
}

interface MultiStepFormProps<Steps, Index = StepIndex<Steps>> {
  steps: Steps;
  initialStep: Index;
  initialValues?: { [P in keyof Steps]?: Values };
  onNext?: (currentStep: Index, values: Values) => Index;
  onPrevious?: (currentStep: Index) => Index;
  useSteps?: UseSteps<Index>;
}

function makeInitialValues<T extends Steps>(
  steps: T,
  initialValues?: { [P in keyof T]?: Values }
) {
  const keys = Object.keys(steps) as (keyof T)[];
  const entries = keys.map((key) => [key, initialValues?.[key] ?? {}]);
  return Object.fromEntries(entries);
}

function MultiStepForm<T extends Steps>({
  steps,
  initialStep,
  initialValues,
  onNext,
  onPrevious,
  useSteps = useRouterSteps,
}: MultiStepFormProps<T>) {
  const [stepValues, setStepValues] = useState<Record<StepIndex<T>, Values>>(
    makeInitialValues(steps, initialValues)
  );
  const { currentStep, setCurrentStep } = useSteps(initialStep);

  if (
    typeof initialStep !== "number" &&
    (onNext === undefined || onPrevious === undefined)
  ) {
    throw new Error(
      "The onNext and onPrevious callbacks are required when using non-numeric step keys."
    );
  }
  if (onNext === undefined) {
    onNext = (step) => ((step as number) + 1) as StepIndex<T>;
  }
  if (onPrevious === undefined) {
    onPrevious = (step) => ((step as number) - 1) as StepIndex<T>;
  }

  const handleNext = (values: Values) => {
    setStepValues((prevState: typeof stepValues) => ({
      ...prevState,
      [currentStep]: values,
    }));
    if (onNext !== undefined) {
      setCurrentStep(onNext(currentStep, values));
    }
  };
  const handlePrevious = () => {
    if (onPrevious !== undefined) {
      setCurrentStep(onPrevious(currentStep));
    }
  };

  const element = steps[currentStep] as React.ReactElement | undefined;

  if (element === undefined) {
    throw new Error(`Step ${currentStep} is not defined.`);
  }

  return (
    <MultiStepFormContext.Provider
      value={{
        step: currentStep,
        values: stepValues,
        onNext: handleNext,
        onPrevious: handlePrevious,
      }}
    >
      {element}
    </MultiStepFormContext.Provider>
  );
}

export { MultiStepForm, useRouterSteps, useStateSteps };
