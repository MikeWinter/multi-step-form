import { useMultiStepForm } from "~/components/MultiStepForm";

function Summary() {
  const { allValues, previous } = useMultiStepForm();

  return (
    <div>
      <pre>
        {JSON.stringify(Object.assign({}, ...Object.values(allValues)))}
      </pre>
      <button onClick={() => previous()}>Previous</button>
    </div>
  );
}

export { Summary };
