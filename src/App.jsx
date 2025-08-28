import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Products } from "./pages/Products";
import { Orders } from "./pages/Orders";
import { Users } from "./pages/Users";
import { ModalProvider } from "./contexts/ModalContext";
import { DataProvider } from "./contexts/DataContext";
import { Modals } from "./components/ui/Modal";

function App() {
  return (
    <DataProvider>
      <ModalProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-100">
            <Routes>
              <Route path="/dashboard" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="users" element={<Users />} />
              </Route>
            </Routes>

            {/* <Modals /> */}
          </div>
          <Modals />
        </BrowserRouter>
      </ModalProvider>
    </DataProvider>
  );
}

export default App;
