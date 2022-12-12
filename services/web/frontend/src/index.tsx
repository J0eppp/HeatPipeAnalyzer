import React from 'react';
import ReactDOM from 'react-dom/client';

import Root from "./views/Root";
import Graph from './views/Graph';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

type route = {
  path: string,
  element: React.ReactElement,
}

const router = createBrowserRouter([
  {  
    path: "/",
    element: <Root />,
  },
  {
    path: "/graph",
    element: <Graph />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);