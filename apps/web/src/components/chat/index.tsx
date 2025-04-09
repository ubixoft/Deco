import {
  AgentNotFoundError,
  useAgent,
  useAgentRoot,
  useCreateAgent,
  useMessages,
  WELL_KNOWN_AGENT_IDS,
} from "@deco/sdk";
import { Button } from "@deco/ui/components/button.tsx";
import { Icon } from "@deco/ui/components/icon.tsx";
import { Spinner } from "@deco/ui/components/spinner.tsx";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ErrorBoundary, useError } from "../../ErrorBoundary.tsx";
import { Chat } from "./Chat.tsx";

function App({ agentId, threadId }: { agentId: string; threadId: string }) {
  const { data: agent, error } = useAgent(agentId);
  const agentRoot = useAgentRoot(agentId);
  const { data: messages } = useMessages(agentId, threadId);
  const createAgent = useCreateAgent();

  if (error) {
    return (
      <div>
        Error loading agent:{" "}
        {error instanceof Error ? String(error) : JSON.stringify(error)}
      </div>
    );
  }

  if (!agent || !messages || !agentRoot) {
    return (
      <div className="h-full bg-background flex flex-col items-center justify-center">
        <div className="relative">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <Chat
      initialMessages={messages}
      agentRoot={agentRoot}
      threadId={threadId}
      agent={agent}
      updateAgent={async (updates) => {
        const updatedAgent = { ...agent, ...updates };
        await createAgent.mutateAsync(updatedAgent);
        return updatedAgent;
      }}
    />
  );
}

function AgentNotFound() {
  const navigate = useNavigate();
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-4 p-6 bg-background">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
        <Icon name="smart_toy" size={32} className="text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">Agent Not Found</h2>
      <p className="text-center text-muted-foreground max-w-md">
        The agent you're looking for doesn't exist or has been deleted.
      </p>
      <Button
        variant="outline"
        onClick={() => navigate("/agents")}
        className="mt-2"
      >
        Back to Agents
      </Button>
    </div>
  );
}

const TEAM_AGENT = {
  id: WELL_KNOWN_AGENT_IDS.teamAgent,
  name: "Deco Chat",
  avatar: "https://deco.chat/logos/team-agent.png",
  description: "I can help you with anything you need.",
  instructions: `
<system>
You are an assistant on a platform designed to help users accomplish their tasks. Your primary objective is to guide users toward completing what they want to do in the simplest and most helpful way possible.

<task_support>
When a user describes a goal that depends on third-party systems, check the platform's marketplace for relevant integrations. Only suggest installing or enabling tools after getting the user's explicit confirmation. Once tools are installed, use them to identify which capabilities are available and assist the user accordingly.
</task_support>

<user_goal_handling>
Users can have two types of goals:
<one_time_task>When the user wants to do something once, help them complete the task directly. Do not suggest creating an agent unless the user implies the need for reuse.</one_time_task>
<repeatable_workflow>When the user wants to set up a solution that can be used repeatedly or by others (e.g., sending emails, analyzing data from spreadsheets), propose creating a specialized agent focused on that purpose. Only proceed after receiving explicit confirmation from the user.</repeatable_workflow>

If the user's intent is unclear, default to handling the request as a one-time task.
NEVER perform actions without the user's explicit permission. Do not write/install/enable/create anything without the user's explicit permission.
</user_goal_handling>

<user_assumptions>
Assume users are non-technical and unfamiliar with the tools or systems needed to complete their goals. Avoid technical jargon. Ask simple, clarifying questions before suggesting a solution to ensure it fits the user's actual need.
</user_assumptions>

<interaction_guidelines>
Offer only 1–2 options at a time to avoid overwhelming the user. Focus on one clear action at a time and always request explicit confirmation before proceeding.
</interaction_guidelines>

<user_consent_rule>
Never perform actions such as installing tools, enabling services, or creating agents without the user's explicit permission. Always ask for confirmation first.
</user_consent_rule>
</system>
`,
};

function CreateTeamAgent() {
  const { reset } = useError();
  const createAgent = useCreateAgent();

  useEffect(() => {
    createAgent.mutate(TEAM_AGENT, {
      onSuccess: () => {
        reset();
      },
    });
  }, []);

  return (
    <div className="h-full bg-background flex flex-col items-center justify-center">
      <div className="relative">
        <Spinner />
      </div>
    </div>
  );
}

export default function AgentChat(
  { agentId, threadId }: { agentId: string; threadId: string },
) {
  // Ensure team agent is created even for new workspaces
  if (agentId === WELL_KNOWN_AGENT_IDS.teamAgent) {
    return (
      <ErrorBoundary
        fallback={<CreateTeamAgent />}
        shouldCatch={(error) => error instanceof AgentNotFoundError}
      >
        <App agentId={agentId} threadId={threadId} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary
      fallback={<AgentNotFound />}
      shouldCatch={(error) => error instanceof AgentNotFoundError}
    >
      <App agentId={agentId} threadId={threadId} />
    </ErrorBoundary>
  );
}
