import { useCallback, useState } from "react";

const useToggle = (initialState = false) => {
  // Initialize the state
  const [state, setState] = useState(initialState);

  const toggle = useCallback(
    (v?: boolean) => setState((state) => (typeof v === "boolean" ? v : !state)),
    []
  );

  return [state, toggle];
};

export default useToggle;
