import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {CssBaseline} from "@mui/material";
import {RouterProvider} from "react-router/dom";
import {router} from "./app/router";

const container = document.getElementById("root");

if (!container) {
    throw new Error("Root element not found!")
}

createRoot(container).render(
    <StrictMode>
        <CssBaseline/>
        <RouterProvider router={router}/>
    </StrictMode>,
);