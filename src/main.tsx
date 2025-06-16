import React from "react"
import ReactDOM from "react-dom/client"
import App from "./pages/App/App.tsx"
import "./index.css"
import { BrowserRouter } from "react-router-dom"
// В вашем корневом layout-файле
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
  </React.StrictMode>
)
