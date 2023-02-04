import logo from "./logo.svg";
import "./App.css";

import React, { useState } from "react";
import Home from "./Pages/Homepage/Home.js";
import { Button } from "@mui/material";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const App = () => {
  return (
    <>
      <Home />
    </>
  );
};

export default App;
