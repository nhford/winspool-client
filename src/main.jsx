import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Signature } from "./components/utility/Footer.jsx";
import SiteLayout from "./components/SiteLayout.jsx";
import Title from "./components/utility/Title.jsx";

/**
 * main.jsx holds root element of site
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Title
      title={"Wins Pool"}
      subTitle={"Who wins from each and every win in the NFL, NBA, and MLB"}
    />
    <SiteLayout />
    <Signature />
  </StrictMode>,
);
