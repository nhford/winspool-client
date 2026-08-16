import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { PoolDataProvider } from "./PoolDataContext";
import { Signature } from "./components/utility/Signature";
import SiteLayout from "./components/SiteLayout";
import Title from "./components/utility/Title";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element #root not found");
}

createRoot(rootEl).render(
  <StrictMode>
    <div className="mx-auto w-full max-w-5xl px-2 text-center sm:px-4">
      <Title
        title={"Wins Pool"}
        subTitle={"Who wins from each and every win in the NFL, NBA, and MLB"}
      />
      <PoolDataProvider>
        <SiteLayout />
      </PoolDataProvider>
      <Signature />
    </div>
  </StrictMode>,
);
