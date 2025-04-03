import { SDK } from "../index.ts";
import { type Integration, IntegrationSchema } from "../models/mcp.ts";

export const MCP_HOME_PATH = "~/Integrations";

/**
 * Convert an MCP to a locator
 *
 * @param mcpId - The MCP id to convert
 * @returns The locator
 */
export const toIntegrationLocator = (mcpId: string) => {
  return `${MCP_HOME_PATH}/${mcpId}.json`;
};

/**
 * Save an MCP to the file system
 * @param mcp - The MCP to save
 */
export const saveIntegration = async (mcp: Integration) => {
  const path = toIntegrationLocator(mcp.id);
  const content = JSON.stringify(mcp);

  await SDK.fs.write(path, content);
};

/**
 * Create a new MCP
 * @returns The new MCP
 */
export const createIntegration = async (template: Partial<Integration>) => {
  const mcp: Integration = {
    name: "New Integration",
    description: "A new multi-channel platform integration",
    icon: "",
    connection: { type: "SSE", url: "https://example.com/sse" },
    ...template,
    id: crypto.randomUUID(),
  };

  await saveIntegration(mcp);

  return mcp;
};

/**
 * Load an MCP from the file system
 * @param mcpId - The id of the MCP to load
 * @returns The MCP or null if not found
 */
export const loadIntegration = async (mcpId: string) => {
  const path = toIntegrationLocator(mcpId);
  const content = await SDK.fs.read(path);

  try {
    return JSON.parse(content) as unknown;
  } catch {
    return null;
  }
};

/**
 * Delete an MCP from the file system
 * @param mcpId - The id of the MCP to delete
 */
export const deleteIntegration = async (mcpId: string) => {
  const path = toIntegrationLocator(mcpId);
  await SDK.fs.unlink(path);
};

/**
 * Validate an MCP against the Zod schema
 *
 * @param mcp - The MCP to validate
 * @returns The validated MCP or an error
 */
export const validateIntegration = (
  mcp: unknown,
): [Integration, null] | [null, Error] => {
  try {
    const validatedMCP = IntegrationSchema.parse(mcp);
    return [validatedMCP, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error("Invalid MCP")];
  }
};
