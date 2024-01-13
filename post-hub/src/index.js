import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Home from "./pages/home";
import Navbar from "./components/navBar";
import './sass/style.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();

root.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Navbar></Navbar>
      <Routes>
        <Route exact path="" element={<Home></Home>} />
      </Routes>

    </QueryClientProvider>
  </BrowserRouter>
);
