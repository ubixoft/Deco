import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useBasePath } from "../../hooks/useBasePath.ts";

// Helper to get agent URL
const getAgentPath = (agentId: string, threadId?: string): string =>
  `/agent/${agentId}/${threadId ?? ""}`;

export const useFocusAgent = () => {
  const navigate = useNavigate();
  const withBasePath = useBasePath();

  const navigateToAgent = useCallback(
    (agentId: string, threadId?: string) => {
      const pathname = withBasePath(getAgentPath(agentId, threadId));

      // Navigate to the agent page
      navigate(pathname);
    },
    [withBasePath],
  );

  return navigateToAgent;
};
