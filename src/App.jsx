import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { AIAnalysis } from "./pages/AIAnalysis";
import { AuthLayout } from "./layouts/AuthLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { RootRedirect } from "./components/RootRedirect";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ToastProvider } from "./components/ui/Toast";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import Product from "./pages/ProductPage";
import Order from "./pages/OrderPage";
import Customer from "./pages/CustomerPage";

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RootRedirect />} />
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
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
