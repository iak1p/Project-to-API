import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Navigate, Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage.tsx";
import RegPage from "./pages/RegPage.tsx";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { ProtectedRoute } from "./components/protected-route.tsx";
import AccountPage from "./pages/AccountPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WorkspacePage from "./pages/WorkspacePage.tsx";

const queryClient = new QueryClient();

// biome-ignore lint/style/noNonNullAssertion: >
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Toaster />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <App />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/workspace/:workspaceId" element={<WorkspacePage />} />
            <Route
              path="/workspace/:workspaceId/model/:modelId"
              element={<WorkspacePage />}
            />

            <Route path="/" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
