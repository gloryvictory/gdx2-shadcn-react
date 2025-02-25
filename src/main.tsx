import React from "react"
import ReactDOM from "react-dom/client"
import App from "./pages/App/App.tsx"
import "./index.css"
import { BrowserRouter } from "react-router-dom"

// import { BrowserRouter as Router } from "react-router-dom"
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <Router> */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {/* <App /> */}
    {/* </Router> */}
  </React.StrictMode>
)
