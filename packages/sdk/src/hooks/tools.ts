import {
  type MCPConnection,
  type MCPTool,
  type MCPToolCall,
  SDK,
} from "../index.ts";
import { WELL_KNOWN_DEFAULT_INTEGRATION_TOOLS } from "../constants.ts";
import { useCallback, useEffect, useState } from "react";

const channel = new EventTarget();

const navigate = (href: string) => {
  const url = new URL(href, globalThis.location.origin);

  globalThis.history.pushState({}, "", url.toString());
  channel.dispatchEvent(new CustomEvent("navigate", { detail: url }));
};

globalThis.addEventListener("popstate", () => {
  channel.dispatchEvent(
    new CustomEvent("navigate", { detail: new URL(globalThis.location.href) }),
  );
});

export function useLocation() {
  const [url, setURL] = useState(new URL(globalThis.location.href));

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      setURL((event as CustomEvent<URL>).detail);
    };

    channel.addEventListener("navigate", handleNavigate);

    return () => {
      channel.removeEventListener("navigate", handleNavigate);
    };
  }, []);

  return url;
}

export function useNavigate() {
  return navigate;
}

type ToolsData = {
  tools: MCPTool[];
  instructions: string;
  version?: {
    name: string;
    version?: string;
  };
  capabilities?: Record<string, unknown>;
};

const INITIAL_DATA: ToolsData = { tools: [], instructions: "" };

export function useTools(connection: MCPConnection) {
  const [data, setData] = useState<ToolsData>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [refresh, setRefresh] = useState(0);

  // Watch for connection changes
  useEffect(() => {
    let cancel = false;

    // Function to load tools when connection is valid
    const loadTools = async (connection: MCPConnection) => {
      try {
        setLoading(true);
        setData(INITIAL_DATA);

        if (connection.type === "INNATE") {
          const data = {
            tools:
              WELL_KNOWN_DEFAULT_INTEGRATION_TOOLS[connection.name as "CORE"]
                .map(
                  (tool) => ({
                    name: tool,
                    description: "",
                    inputSchema: {},
                  }),
                ),
            instructions: "",
          };
          setData(data);
          setError(null);
          return;
        }

        const data = await SDK.mcps.listTools(connection);

        if (cancel) {
          return;
        }

        setData(data);
        setError(null);
      } catch (error) {
        console.error(
          "Failed to load tools:",
          error instanceof Error ? error.message : "Unknown error",
        );

        if (cancel) {
          return;
        }

        setData(INITIAL_DATA);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    loadTools(connection);

    return () => {
      cancel = true;
    };
  }, [connection, refresh]);

  return {
    refresh: () => setRefresh((f) => f + 1),
    data,
    loading,
    error,
  };
}

export function useToolCall(connection: MCPConnection) {
  const toolCall = useCallback(
    (toolCall: MCPToolCall) => SDK.mcps.toolCall(connection, toolCall),
    [connection],
  );

  return toolCall;
}
