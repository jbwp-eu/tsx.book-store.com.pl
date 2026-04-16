import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/i18n/i18n";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import StateContextProvider from "./components/StateContext.tsx";

// import { ThemeProvider } from "./components/ThemeProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Provider>
  </StrictMode>
);
