import { useCallback, useMemo } from "react";
import {
  MCP_HOME_PATH,
  toIntegrationLocator,
  validateIntegration,
} from "../crud/mcp.ts";
import {
  createIntegration,
  deleteIntegration,
  saveIntegration,
} from "../crud/mcp.ts";
import type { Integration } from "../models/mcp.ts";
import { useFile, useFileList } from "./fs.ts";
import { WELL_KNOWN_DEFAULT_INTEGRATION_TOOLS } from "../constants.ts";

/**
 * Hook to create a new MCP
 * @returns Function to create a new MCP
 */
export const useCreateIntegration = () => {
  const create = useCallback(createIntegration, []);

  return create;
};

const DEFAULT_INTEGRATION_ICONS = {
  CORE: "https://deco.chat/img/deco/deco-avocado-light.png",
};

const isWellKnownIntegration = (
  mcpId: string,
): mcpId is keyof typeof WELL_KNOWN_DEFAULT_INTEGRATION_TOOLS =>
  mcpId in WELL_KNOWN_DEFAULT_INTEGRATION_TOOLS;

/**
 * Hook for CRUD operations on a specific MCP
 * @param mcpId - The ID of the MCP to operate on
 * @returns Object with MCP data and CRUD operations
 */
export const useIntegration = (mcpId: string) => {
  if (isWellKnownIntegration(mcpId)) {
    return {
      data: {
        id: mcpId,
        name: mcpId.toLowerCase(),
        description: `Default ${mcpId} integration`,
        icon: DEFAULT_INTEGRATION_ICONS[mcpId],
        connection: {
          type: "INNATE",
          name: mcpId,
        },
      } as Integration,
      error: null,
      loading: false,
      update: () => Promise.resolve(null),
      remove: () => Promise.resolve(null),
    };
  }

  const path = useMemo(() => toIntegrationLocator(mcpId), [mcpId]);
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
      const [validatedMCP, validationError] = validateIntegration(parsedData);

      if (validationError) {
        return { data: null, error: validationError, loading: false };
      } else {
        return {
          data: { ...validatedMCP, id: mcpId },
          error: null,
          loading: false,
        };
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error
          ? err
          : new Error("Failed to parse MCP data"),
        loading: false,
      };
    }
  }, [file.data, file.loading, file.error]);

  // CRUD operations
  const update = useCallback(async (updates: Partial<Integration>) => {
    if (!result.data) {
      throw new Error("Cannot update: MCP not loaded");
    }

    const updated = { ...result.data, ...updates, id: mcpId };

    // Validate the updated MCP
    const [validatedMCP, validationError] = validateIntegration(updated);

    if (validationError) {
      throw validationError;
    }

    await saveIntegration(updated);

    return validatedMCP;
  }, [result.data, path]);

  const remove = useCallback(() => deleteIntegration(mcpId), [mcpId]);

  return { ...result, update, remove };
};

/**
 * Hook for listing all MCPs
 * @returns Object with list of MCP IDs and loading state
 */
export const useIntegrations = () => {
  // Get all files in the MCPs directory
  const files = useFileList(MCP_HOME_PATH, { recursive: true });

  // Extract MCP IDs from manifest files
  const result = useMemo(() => {
    if (files === null) {
      return { items: [], loading: true, error: null };
    }

    try {
      // Extract MCP IDs from paths
      const items = files.map((file) => {
        // Must match paths like: /MCPs/123/.webdraw/manifest.json$
        const matches = file.match(/\/Integrations\/(.*)\.json$/);
        return matches ? matches[1] : null;
      }).filter((id): id is string => id !== null);

      return {
        items,
        loading: false,
        error: null,
      };
    } catch (err) {
      return {
        items: [],
        loading: false,
        error: err instanceof Error
          ? err
          : new Error("Failed to process MCP files"),
      };
    }
  }, [files]);

  return result;
};
