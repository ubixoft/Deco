import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

const IntegrationDetails = lazy(() =>
  import("./components/integrations/detail/index.tsx")
);

const IntegrationList = lazy(() =>
  import("./components/integrations/list/index.tsx")
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="integrations"
          element={<IntegrationList />}
        />
        <Route
          path="integration/:id"
          element={<IntegrationDetails />}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
