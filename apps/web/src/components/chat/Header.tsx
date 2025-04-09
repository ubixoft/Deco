import { type Agent, WELL_KNOWN_AGENT_IDS } from "@deco/sdk";
import { Button } from "@deco/ui/components/button.tsx";
import { Icon } from "@deco/ui/components/icon.tsx";
import { togglePanel } from "../agent/index.tsx";
import { AgentAvatar } from "../common/Avatar.tsx";
import { TopbarAction, TopbarBreadcrumb } from "../topbar/portal.tsx";

interface ChatHeaderProps {
  agent: Agent;
}

const DEFAULT_LAYOUT_SETTINGS = {
  initialWidth: 400,
  maximumWidth: 400,
  position: { direction: "right" },
};

export function ChatHeader({ agent }: ChatHeaderProps) {
  const handleSettings = () => {
    togglePanel({
      id: "settings",
      component: "settings",
      title: "Agent Settings",
      params: { agentId: agent.id },
      ...DEFAULT_LAYOUT_SETTINGS,
    });
  };

  const handleThreads = () => {
    togglePanel({
      id: "threads",
      component: "threads",
      title: "Agent Threads",
      params: { agentId: agent.id },
      ...DEFAULT_LAYOUT_SETTINGS,
    });
  };

  return (
    <>
      <TopbarBreadcrumb>
        {agent.id === WELL_KNOWN_AGENT_IDS.teamAgent
          ? (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Icon name="forum" size={16} />
              <h1 className="text-sm font-medium tracking-tight">
                New chat
              </h1>
            </div>
          )
          : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[10px] overflow-hidden flex items-center justify-center">
                <AgentAvatar
                  name={agent.name}
                  avatar={agent.avatar}
                  className="rounded-lg text-xs"
                />
              </div>
              <h1 className="text-sm font-medium tracking-tight">
                {agent.name}
              </h1>
            </div>
          )}
      </TopbarBreadcrumb>
      <TopbarAction>
        <div className="ml-auto flex items-center gap-2">
          <Button
            onClick={handleThreads}
            variant="outline"
            size="icon"
            className="rounded-full hover:bg-muted"
            aria-label="Threads"
          >
            <Icon
              size={16}
              name="manage_search"
              className="text-muted-foreground"
            />
          </Button>
          <Button
            onClick={handleSettings}
            variant="outline"
            size="icon"
            className="rounded-full hover:bg-muted"
            aria-label="Start new chat"
          >
            <Icon size={16} name="tune" className="text-muted-foreground" />
          </Button>
        </div>
      </TopbarAction>
    </>
  );
}
