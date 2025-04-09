import { useCallback, useEffect, useState } from "react";
import { SDK, type UIState } from "../index.ts";

const EMPTY_RUNTIME: Partial<UIState> = {};

/**
 * Returns the runtime state.
 *
 * @example
 * ```typescript
 * const { state, dispatch } = useRuntime();
 * ```
 *
 * @returns The runtime state and dispatch function.
 */
export const useRuntime = () => {
  const [state, setState] = useState<UIState | null>(null);

  const dispatch = useCallback((event: { type: string; payload: unknown }) => {
    SDK.os.dispatch(event);
  }, []);

  useEffect(() => {
    let cancel = false;

    SDK.os.onUIUpdate((state) => {
      if (cancel) {
        return;
      }

      setState(state);
    });

    const init = async () => {
      setState(null);

      const state = await SDK.os.state();

      if (cancel) {
        return;
      }

      // do not set state if it is already set by the onUIUpdate event
      setState((s) => s ? s : state);
    };

    init();

    return () => {
      cancel = true;
    };
  }, []);

  return { state: state || EMPTY_RUNTIME, dispatch };
};
