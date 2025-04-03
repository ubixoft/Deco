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

const AgentsList = lazy(() => import("./components/agents/list.tsx"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/agents.html"
          element={<AgentsList />}
        />
        <Route
          path="/agents"
          element={<AgentsList />}
        />
        <Route
          path="integrations.html"
          element={<IntegrationList />}
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
