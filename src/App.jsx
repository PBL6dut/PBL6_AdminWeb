import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { AIAnalysis } from "./pages/AIAnalysis";
import { AuthLayout } from "./layouts/AuthLayout";
import { AuthProvider } from "./contexts/AuthContext";
// import { ProductForm } from "./components/ui/Form";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import Product from "./pages/ProductPage";
import Customer from "./pages/CustomerPage";
import Order from "./pages/OrderPage";

function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" />
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
            <Route path="/dashboard" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Product />} />
              <Route path="orders" element={<Order />} />
              <Route path="customers" element={<Customer />} />
              <Route path="ai-analysis" element={<AIAnalysis />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  );
}

export default App;
