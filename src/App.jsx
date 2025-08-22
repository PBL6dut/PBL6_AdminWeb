import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Dashboard } from "./pages/Dashboard";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<MainLayout />} >
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>  
    </BrowserRouter>
  );
}

export default App;
