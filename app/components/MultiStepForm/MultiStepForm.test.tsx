import React from "react";
import { MemoryRouter } from "react-router";
import type { RenderOptions } from "@testing-library/react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MultiStepForm, useRouterSteps, useStateSteps } from "./MultiStepForm";
import { useMultiStepForm } from "./useMultiStepForm";

const setup = (component: React.ReactElement, options: RenderOptions = {}) => ({
  user: userEvent.setup(),
  ...render(component, { wrapper: RouterWrapper, ...options }),
});

function RouterWrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

function NextButton({
  children,
  value = {},
}: {
  children: React.ReactNode;
  value?: Record<string, string>;
}) {
  const { next } = useMultiStepForm();
  // Use act() to avoid a warning when invoking the hook's callback
  return <button onClick={() => act(() => next(value))}>{children}</button>;
}

function PreviousButton({ children }: { children: React.ReactNode }) {
  const { previous } = useMultiStepForm();
  // Use act() to avoid a warning when invoking the hook's callback
  return <button onClick={() => act(() => previous())}>{children}</button>;
}

describe("MultiStepForm", () => {
  const nextMock = jest.fn();
  const previousMock = jest.fn();

  it.each([
    { steps: [<p key={0}>text</p>], initialStep: 0 },
    { steps: { first: <p>text</p> }, initialStep: "first" as const },
  ])(
    "displays the initial step: $initialStep",
    async ({ steps, initialStep }) => {
      setup(
        <MultiStepForm
          steps={steps}
          initialStep={initialStep}
          onNext={nextMock}
          onPrevious={previousMock}
        />
      );

      expect(await screen.findByText("text")).toBeInTheDocument();
    }
  );

  function TestComponent() {
    const { values } = useMultiStepForm();
    return <p>{values.aKey}</p>;
  }

  it.each([
    {
      steps: [<TestComponent key={0} />, <p key={1} />],
      initialStep: 0,
      initialValues: [{ aKey: "abc" }, { aKey: "xyz" }],
    },
    {
      steps: { actual: <TestComponent />, other: <p /> },
      initialStep: "actual" as const,
      // Initial values can also be absent
      initialValues: { actual: { aKey: "abc" } },
    },
  ])(
    "provides initial values",
    async ({ steps, initialStep, initialValues }) => {
      setup(
        <MultiStepForm
          steps={steps}
          initialStep={initialStep}
          initialValues={initialValues}
          onNext={nextMock}
          onPrevious={previousMock}
        />
      );

      expect(await screen.findByText("abc")).toBeInTheDocument();
    }
  );

  describe.each([{ hook: useStateSteps }, { hook: useRouterSteps }])(
    "changing steps ($hook.name)",
    ({ hook: useSteps }) => {
      it.each([
        {
          steps: [
            <NextButton key={0}>first</NextButton>,
            <span key={1}>second</span>,
          ],
          initialStep: 0,
          nextStep: 1,
        },
        {
          steps: {
            first: <NextButton>first</NextButton>,
            second: <span>second</span>,
          },
          initialStep: "first" as const,
          nextStep: "second" as const,
        },
      ])(
        "moves to the next step: $nextStep",
        async ({ steps, initialStep, nextStep }) => {
          const { user } = setup(
            <MultiStepForm
              steps={steps}
              initialStep={initialStep}
              onNext={() => nextStep}
              onPrevious={previousMock}
              useSteps={useSteps}
            />
          );

          await user.click(
            await screen.findByRole("button", { name: "first" })
          );

          expect(await screen.findByText("second")).toBeInTheDocument();
          expect(
            screen.queryByRole("button", { name: "first" })
          ).not.toBeInTheDocument();
        }
      );

      it.each([
        {
          steps: [
            <span key={0}>first</span>,
            <PreviousButton key={1}>second</PreviousButton>,
          ],
          initialStep: 1,
          previousStep: 0,
        },
        {
          steps: {
            first: <span>first</span>,
            second: <PreviousButton>second</PreviousButton>,
          },
          initialStep: "second" as const,
          previousStep: "first" as const,
        },
      ])(
        "moves to the previous step: $previousStep",
        async ({ steps, initialStep, previousStep }) => {
          const { user } = setup(
            <MultiStepForm
              steps={steps}
              initialStep={initialStep}
              onNext={nextMock}
              onPrevious={() => previousStep}
              useSteps={useSteps}
            />
          );

          await user.click(
            await screen.findByRole("button", { name: "second" })
          );

          expect(await screen.findByText("first")).toBeInTheDocument();
          expect(
            screen.queryByRole("button", { name: "second" })
          ).not.toBeInTheDocument();
        }
      );
    }
  );

  it("saves values when moving to the next step", async () => {
    function Form() {
      const { values } = useMultiStepForm();
      return (
        <>
          <p data-testid="form">{values.key}</p>
          <NextButton value={{ key: "value" }}>Next</NextButton>
        </>
      );
    }

    function Summary() {
      const { allValues } = useMultiStepForm();
      return (
        <>
          <p data-testid="summary">{allValues[0].key}</p>
          <PreviousButton>Previous</PreviousButton>
        </>
      );
    }

    const { user } = setup(
      <MultiStepForm
        steps={[<Form key={0} />, <Summary key={1} />]}
        initialStep={0}
        onNext={(step) => step + 1}
        onPrevious={(step) => step - 1}
      />
    );

    expect(await screen.findByTestId("form")).toHaveTextContent("");
    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(await screen.findByTestId("summary")).toHaveTextContent("value");
    await user.click(screen.getByRole("button", { name: /previous/i }));

    expect(await screen.findByTestId("form")).toHaveTextContent("value");
  });
});
