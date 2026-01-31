import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import AuthCallback from "./AuthCallback.jsx"

const isCallback = window.location.pathname === "/auth/callback"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>{isCallback ? <AuthCallback /> : <App />}</React.StrictMode>
)
