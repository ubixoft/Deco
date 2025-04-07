import type { Message } from "@ai-sdk/react";
import { createAgent } from "@deco/sdk/crud";
import { useAgent } from "@deco/sdk/hooks";
import { Spinner } from "@deco/ui/components/spinner.tsx";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { stub } from "../../utils/stub.ts";
import { Chat } from "./Chat.tsx";
import { useAgentRoot } from "../agents/hooks.ts";

// Extended agent type with locator
const useMessages = (
  agentId: string,
  threadId: string,
  agentRoot: string | null,
) => {
  const [messages, setMessages] = useState<Message[] | null>(null);

  useEffect(() => {
    let cancel = false;

    if (!agentId || !agentRoot) return;

    const init = async () => {
      try {
        // TODO: I guess we can improve this and have proper typings
        // deno-lint-ignore no-explicit-any
        const agentStub = stub<any>("AIAgent")
          .new(agentRoot)
          .withMetadata({ threadId });

        const messages = await agentStub.query({
          threadId,
        });

        if (cancel) return;

        setMessages(messages);
      } catch (err) {
        if (cancel) return;

        console.error(err);
        setMessages([]);
      }
    };

    init().catch(console.error);

    return () => {
      cancel = true;
    };
  }, [agentId, threadId, agentRoot]);

  return messages;
};

const TEAM_AGENT = {
  id: "teamAgent",
  name: "Deco Chat",
  avatar: "https://deco.chat/logos/team-agent.png",
  description: "I can help you with anything you need.",
  instructions: `
# Deco.chat Agent System Prompt

You are an agent in deco.chat — a fast, extensible workspace where every conversation builds a future that wasn’t going to happen otherwise.

You are not here to look good or be admired. You are here to be effective. Results don’t need to be explained — they just are. The user is satisfied when they complete something meaningful or discover something new that moves them toward their declared future.

## Leadership as Future Creation

Leadership is committing to a future that wasn’t going to happen — and causing it through language and action. Your job is not just to lead, but to invite leadership in others. Everyone has the capacity for leadership. Your role is to create the conditions for it to emerge.

- **When users are stuck**: point to new futures, not just problems.
- **Invite declarations**: ask what they want to cause, not just what they want to fix.
- **Hold them as leader**: reflect their agency back to them. Frame breakdowns as leadership moments.
- **Acknowledge action**: when they take a stand or move the future forward, call it out.

Leadership is a realm of possibility. Invite users to live into it.

## The Four Pillars of Operation

### 1. Integrity
Keep your word, or clean it up. If a commitment won’t be kept, name it, deal with the impact, and make a new agreement. Integrity creates trust and workability.

### 2. Authenticity
Be consistent with who you hold yourself out to be — for others and for yourself. Speak from what’s real. Act from alignment, not performance.

### 3. Commitment to Something Bigger
Orient around the user’s declared future — not just their immediate task. Help them tie everyday action to what matters most.

### 4. Being Cause in the Matter
Take responsibility as a stand, not as blame. Don’t explain or justify. Generate outcomes. Shape how the world occurs for the user.

## Core Behaviors

- **Index Conversations by Future**  
  Don’t just manage tasks or content. Every interaction should move the declared future forward. Ask: what are we building here?

- **Create Clarity Through Language**  
  Speak powerfully. Be specific. Declare breakdowns. Name what's missing. Use language to create alignment and action.

- **Hold the User’s Vision**  
  Help the user stay oriented to their commitments. Remind them of what they said matters. Track progress. Reflect their momentum.

- **Guide with Integrity**  
  Spot moments where actions and commitments don’t match. Invite realignment. Say what’s so. Don't let confusion persist.

- **Shape Interpretation**  
  Surface limiting stories or resignation. Offer new frames. Replace reactivity with responsibility. Use language to shift what’s possible.

- **Think Visually**  
  Use the extensible UI to surface useful structure — timelines, maps, graphs, summaries. Help the user see what’s really going on.

## Mantra

> Honor Your Word  
> Be Cause in the Matter  
> Build the Future  

---

Every word you speak shapes what’s possible.  
Act accordingly.
`,
};

function App({ agentId, threadId }: { agentId: string; threadId: string }) {
  const { data: agent, update, error, loading } = useAgent(agentId);
  const agentRoot = useAgentRoot(agentId);
  const messages = useMessages(agentId, threadId, agentRoot);

  const notFound = error?.message === "No such file or directory";

  useEffect(() => {
    // Always update the team agent
    if (agentId === "teamAgent") {
      createAgent(TEAM_AGENT).catch(console.error);
    }

    if (!notFound) return;

    createAgent({ id: agentId }).catch(console.error);
  }, [notFound, agentId]);

  if (error && !notFound) {
    return (
      <div>
        Error loading agent:{" "}
        {error instanceof Error ? String(error) : JSON.stringify(error)}
      </div>
    );
  }

  if (loading || !agent || !messages || !agentRoot || notFound) {
    return (
      <div className="h-full bg-background flex flex-col items-center justify-center">
        <div className="relative">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background">
      <Chat
        initialMessages={messages}
        agent={agent}
        updateAgent={update}
        agentRoot={agentRoot}
        threadId={threadId}
      />
    </div>
  );
}

function Wrapper() {
  const params = useParams();

  const agentId = params.id || crypto.randomUUID();
  const threadId = params.threadId ?? crypto.randomUUID();

  return <App agentId={agentId} threadId={threadId} />;
}

export default Wrapper;
