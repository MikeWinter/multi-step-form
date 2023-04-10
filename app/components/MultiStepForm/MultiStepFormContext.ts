import { createContext } from "react";

type Values = { [key: string]: string | number | boolean };
type AllValues = { [key: string | number]: Values };

export interface Context {
  step: string | number;
  values: AllValues;
  onNext: (values: Values) => void;
  onPrevious: () => void;
}

const MultiStepFormContext = createContext<Context | null>(null);

export { MultiStepFormContext };
export type { Values };
