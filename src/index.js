import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Home from "./pages/home";
import SignUp from "./pages/signUp";
import LogIn from "./pages/logIn";
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
        <Route exact path="/sign-up" element={<SignUp></SignUp>} />
        <Route exact path="/log-in" element={<LogIn></LogIn>} />
      </Routes>

    </QueryClientProvider>
  </BrowserRouter>
);
