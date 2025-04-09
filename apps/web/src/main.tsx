import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

const IntegrationNew = lazy(() =>
  import("./components/integrations/detail/new.tsx")
);

const IntegrationEdit = lazy(() =>
  import("./components/integrations/detail/edit.tsx")
);

const IntegrationList = lazy(() =>
  import("./components/integrations/list/index.tsx")
);

const AgentsList = lazy(
  () => import("./components/agents/list.tsx"),
);

const AgentDetail = lazy(
  () => import("./components/chat/index.tsx"),
);

const AgentEdit = lazy(
  () => import("./components/settings/index.tsx"),
);

const ThreadsList = lazy(
  () => import("./components/threads/list.tsx"),
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/agents"
          element={<AgentsList />}
        />
        <Route
          path="/agent/:id/settings"
          element={<AgentEdit />}
        />
        <Route
          path="/agent/:id/threads"
          element={<ThreadsList />}
        />
        <Route
          path="/agent/:id/:threadId?"
          element={<AgentDetail />}
        />
        <Route
          path="integrations"
          element={<IntegrationList />}
        />
        <Route
          path="integration/new"
          element={<IntegrationNew />}
        />
        <Route
          path="integration/:id"
          element={<IntegrationEdit />}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
