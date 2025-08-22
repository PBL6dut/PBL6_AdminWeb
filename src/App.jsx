import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Dashboard } from "./pages/Dashboard";
// import { Products } from "./pages/Products";
// import { Orders } from "./pages/Orders";
// import { Users } from "./pages/Users";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<MainLayout />} >
          <Route index element={<Dashboard />} />
          {/* <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/users" element={<Users />} /> */}
        </Route>
      </Routes>  
    </BrowserRouter>
  );
}

export default App;
