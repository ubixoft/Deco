import { useCallback, useMemo } from "react";
import type { Agent } from "../models/agent.ts";
import {
  createAgent,
  deleteAgent,
  HOME_PATH,
  MANIFEST_PATH,
  saveAgent,
  toLocator,
  validateAgent,
} from "../crud/agent.ts";
import { useFile, useFileList } from "./fs.ts";

export const useCreateAgent = () => {
  const create = useCallback(createAgent, []);

  return create;
};

/** Hook for crud-like operations on agents */
export const useAgent = (agentId: string) => {
  const path = useMemo(() => toLocator(agentId), [agentId]);
  const file = useFile(path, { encoding: "utf-8" });

  // Parse file content directly in useMemo without using state
  const result = useMemo(() => {
    if (file.error) {
      return { data: null, error: file.error, loading: false };
    }

    if (file.loading || file.data === null) {
      return { data: null, error: null, loading: true };
    }

    try {
      const parsedData = JSON.parse(file.data);
      const [validatedAgent, validationError] = validateAgent(parsedData);

      if (validationError) {
        return { data: null, error: validationError, loading: false };
      } else {
        return {
          data: { ...validatedAgent, id: agentId },
          error: null,
          loading: false,
        };
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error
          ? err
          : new Error("Failed to parse agent data"),
        loading: false,
      };
    }
  }, [file.data, file.loading, file.error]);

  // CRUD operations - simplified to use SDK.fs.write directly
  const update = useCallback(async (updates: Partial<Agent>) => {
    if (!result.data) {
      throw new Error("Cannot update: Agent not loaded");
    }

    const updatedAgent = {
      ...result.data,
      ...updates,
      id: agentId,
    };

    // Validate the updated agent
    const [validatedAgent, validationError] = validateAgent(updatedAgent);

    if (validationError) {
      throw validationError;
    }

    // Save directly using SDK.fs.write
    await saveAgent(validatedAgent);

    return validatedAgent;
  }, [result.data, path]);

  const remove = useCallback(() => deleteAgent(agentId), [agentId]);

  return { ...result, update, remove };
};

/** Hook for listing all agents */
export const useAgents = () => {
  // Get all files in the agents directory
  const files = useFileList(HOME_PATH, { recursive: true });

  // Extract agent IDs from manifest files
  const result = useMemo(() => {
    if (files === null) {
      return { items: [], loading: true, error: null };
    }

    try {
      // Filter for manifest.json files in the Agents directory
      const manifestPaths = files.filter((file) =>
        file.endsWith(MANIFEST_PATH)
      );

      // Extract agent IDs from paths
      const agentIds = manifestPaths.map((file) => {
        // Must match paths like: /Agents/123/.webdraw/manifest.json$
        const matches = file.match(/\/Agents\/(.*)\/.webdraw\/manifest\.json$/);
        return matches ? matches[1] : null;
      }).filter((id): id is string => id !== null);

      return {
        items: agentIds,
        loading: false,
        error: null,
      };
    } catch (err) {
      return {
        items: [],
        loading: false,
        error: err instanceof Error
          ? err
          : new Error("Failed to process agent files"),
      };
    }
  }, [files]);

  return result;
};
