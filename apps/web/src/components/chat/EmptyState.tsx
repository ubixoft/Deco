import { type Agent, WELL_KNOWN_AGENT_IDS } from "@deco/sdk";
import { AgentAvatar } from "../common/Avatar.tsx";

export function Welcome({ agent }: { agent?: Agent }) {
  if (agent?.id === WELL_KNOWN_AGENT_IDS.teamAgent) {
    return (
      <div className="py-10">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-2xl font-medium leading-loose text-slate-700">
            What can I help with?
          </div>
          <div className="text-sm font-normal text-slate-500 max-w-[510px] text-center">
            Use this chat to ask questions, generate content, create and
            schedule tasks,{" "}
            <span className="italic font-crimson-pro">
              create personalized agents
            </span>, or manage team settings.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between py-12">
      <div className="flex flex-col items-center justify-center max-w-[800px] mx-auto p-4 duration-300 transition-all">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="w-12 h-12 flex items-center justify-center ">
            <AgentAvatar
              name={agent?.name}
              avatar={agent?.avatar}
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-3xl font-medium text-slate-800">
              {agent?.name
                ? `Hello, I'm ${agent.name}`
                : "Tell me who I am and how I should be"}
            </h2>
            <p className="text-slate-500 mx-6">
              {agent?.description ?? "The more you share, the better I get."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
