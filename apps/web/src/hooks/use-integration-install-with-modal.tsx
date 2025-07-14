// deno-lint-ignore-file no-explicit-any
import { useState } from "react";
import {
  useCreateAPIKey,
  useCreateIntegration,
  useGetRegistryApp,
  useInstallFromMarketplace,
} from "@deco/sdk/hooks";
import type { Integration } from "@deco/sdk/models";
import type { JSONSchema7 } from "json-schema";
import { useWorkspaceLink } from "./use-navigate-workspace.ts";

// Default policies required for all integrations
const DEFAULT_INTEGRATION_POLICIES = [
  { effect: "allow" as const, resource: "INTEGRATIONS_GET" },
  { effect: "allow" as const, resource: "DATABASES_RUN_SQL" },
];

// Human-readable permission descriptions
const PERMISSION_DESCRIPTIONS: Record<string, string> = {
  INTEGRATIONS_GET: "Access your integrations",
  DATABASES_RUN_SQL: "Run database queries",
  KNOWLEDGE_BASE_ADD_FILE: "Add files to your knowledge base",
  KNOWLEDGE_BASE_LIST_FILES: "View your knowledge base files",
  KNOWLEDGE_BASE_DELETE_FILE: "Delete files from your knowledge base",
  PROMPTS_CREATE: "Create new prompts",
  PROMPTS_LIST: "View your prompts",
  PROMPTS_UPDATE: "Update your prompts",
  PROMPTS_DELETE: "Delete your prompts",
  API_KEYS_CREATE: "Create API keys",
  API_KEYS_LIST: "View your API keys",
  AI_GENERATE: "Generate AI content",
  // Common integration scopes
  HOSTING_APP_DEPLOY: "Deploy applications",
  HOSTING_APP_DELETE: "Delete applications",
  HOSTING_APP_LIST: "List your applications",
  HOSTING_APP_INFO: "View application information",
  REGISTRY_PUBLISH_APP: "Publish apps to registry",
  REGISTRY_GET_APP: "Access app registry",
  REGISTRY_LIST_APPS: "List registry apps",
  THREADS_CREATE: "Create new threads",
  THREADS_LIST: "View your threads",
  THREADS_UPDATE: "Update threads",
  THREADS_DELETE: "Delete threads",
  AGENTS_CREATE: "Create new agents",
  AGENTS_LIST: "View your agents",
  AGENTS_UPDATE: "Update agents",
  AGENTS_DELETE: "Delete agents",
  // File system operations
  FS_READ: "Read files from workspace",
  FS_WRITE: "Write files to workspace",
  FS_DELETE: "Delete files from workspace",
  FS_LIST: "List workspace files",
  // External service integrations
  GOOGLE_DRIVE_ACCESS: "Access your Google Drive",
  GOOGLE_SHEETS_ACCESS: "Access your Google Sheets",
  GOOGLE_CALENDAR_ACCESS: "Access your Google Calendar",
  GITHUB_ACCESS: "Access your GitHub repositories",
  SLACK_ACCESS: "Access your Slack workspace",
  NOTION_ACCESS: "Access your Notion workspace",
  // Add more as needed
};

interface InstallState {
  isModalOpen: boolean;
  scopes?: string[];
  stateSchema?: JSONSchema7;
  integrationName?: string;
  integration?: Integration;
  appName?: string;
  appId?: string;
  provider?: string;
}

export function useIntegrationInstallWithModal() {
  const [installState, setInstallState] = useState<InstallState>({
    isModalOpen: false,
  });

  const getLinkFor = useWorkspaceLink();
  const installMutation = useInstallFromMarketplace();
  const createIntegration = useCreateIntegration();
  const createAPIKey = useCreateAPIKey();
  const getRegistryApp = useGetRegistryApp();

  const handleInstall = async (params: {
    appId: string;
    appName: string;
    provider: string;
    returnUrl: string;
  }) => {
    try {
      const result = await installMutation.mutateAsync(params);

      // If we get a stateSchema, show the modal
      if (result.stateSchema) {
        let scopes = result.scopes || [];

        // If no scopes were returned, try to get them from the registry app
        if (!scopes || scopes.length === 0) {
          try {
            const registryApp = await getRegistryApp.mutateAsync({
              name: params.appName,
            });

            // Check if the registry app has scope information
            // Note: This might not exist in the current schema, but we can check
            if (registryApp && "scopes" in registryApp) {
              scopes = (registryApp as any).scopes || [];
            }
          } catch (error) {
            console.warn("Failed to get registry app info:", error);
          }
        }

        setInstallState({
          isModalOpen: true,
          stateSchema: result.stateSchema as JSONSchema7,
          scopes: scopes,
          integrationName: params.appName,
          integration: result.integration,
          appName: params.appName,
          provider: params.provider,
        });
      } else if (result.redirectUrl) {
        // Handle redirect URL as before
        globalThis.location.href = result.redirectUrl;
      }

      return result;
    } catch (error) {
      console.error("Installation failed:", error);
      throw error;
    }
  };

  const handleModalSubmit = async (formData: Record<string, unknown>) => {
    if (!installState.appName || !installState.provider) {
      throw new Error("Missing app name or provider");
    }

    try {
      // Step 1: Generate API key with required policies
      const installId = installState.integration?.id ?? crypto.randomUUID();
      const keyName = `${installState.appName}-${installId}`;

      const apiKey = await createAPIKey.mutateAsync({
        claims: {
          state: formData,
        },
        name: keyName,
        policies: [
          ...DEFAULT_INTEGRATION_POLICIES,
          ...(installState.scopes?.map((scope: string) => ({
            effect: "allow" as const,
            resource: scope,
          })) ?? []),
        ],
      });

      // Step 2: Get marketplace app info
      const marketplaceApp = await getRegistryApp.mutateAsync({
        name: installState.appName,
      });

      // Step 3: Create integration with marketplace info and API token
      const integrationData = {
        id: installId,
        name: marketplaceApp.name,
        description: marketplaceApp.description,
        icon: marketplaceApp.icon,
        connection: {
          ...marketplaceApp.connection,
          token: apiKey.value,
          // Merge form data into connection
          ...formData,
        }, // Type assertion to handle the connection type
      };

      await createIntegration.mutateAsync(integrationData);

      // Close modal after successful submission
      setInstallState((prev: InstallState) => ({
        ...prev,
        isModalOpen: false,
      }));

      // Step 4: Redirect to the connections page after a brief delay
      // This ensures all async operations are fully processed before redirect

      const redirectPath = getLinkFor(`/connection/unknown:::${installId}`);
      globalThis.location.href = redirectPath;
    } catch (error) {
      console.error("Failed to complete setup:", error);
      throw error;
    }
  };

  const handleModalClose = () => {
    setInstallState((prev: InstallState) => ({ ...prev, isModalOpen: false }));
  };

  // Get all permissions (default + scopes) with descriptions
  const getAllPermissions = (scopes?: string[]) => {
    const allScopes = [
      ...DEFAULT_INTEGRATION_POLICIES.map((policy) => policy.resource),
      ...(scopes ?? installState.scopes ?? []),
    ];

    return allScopes.map((scope) => ({
      scope,
      description: PERMISSION_DESCRIPTIONS[scope] || scope,
    }));
  };

  return {
    // Install function
    install: handleInstall,

    // Modal state and handlers
    modalState: {
      isOpen: installState.isModalOpen,
      schema: installState.stateSchema,
      scopes: installState.scopes,
      permissions: getAllPermissions(installState.scopes),
      integrationName: installState.integrationName,
      integration: installState.integration,
      onSubmit: handleModalSubmit,
      onClose: handleModalClose,
      isLoading: createAPIKey.isPending || getRegistryApp.isPending ||
        createIntegration.isPending,
    },

    // Mutation state
    isLoading: installMutation.isPending,
    error: installMutation.error,
  };
}
