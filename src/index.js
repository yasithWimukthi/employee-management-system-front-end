import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import Theme from "./Theme/Theme";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  
    <BrowserRouter>
      <Provider store={store}>
        <Theme>
          <App />
        </Theme>
      </Provider>
    </BrowserRouter>
  
);
