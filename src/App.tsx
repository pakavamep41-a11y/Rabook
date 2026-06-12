import { lazy, Suspense, ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useStore } from "./lib/store";
import Layout from "./components/ui/Layout";

// Lazy loading our tree pathways
const CatalogHome = lazy(() => import("./features/catalog/components/CatalogHome"));
const ProductDetail = lazy(() => import("./features/catalog/components/ProductDetail"));
const CartPage = lazy(() => import("./features/catalog/components/CartPage"));
const AccountDashboard = lazy(() => import("./features/account/components/AccountDashboard"));
const LoginRegister = lazy(() => import("./features/account/components/LoginRegister"));
const AdminPanel = lazy(() => import("./features/admin/components/AdminPanel"));

const UiPlayground = lazy(() => import("./pages/UiPlayground"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Suspense Persian custom loading fallback spinner
function PersianLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs text-slate-500 font-bold">در حال بارگزاری بخش‌های هوشمند چاپخانه...</span>
    </div>
  );
}

// Client authentication guard
function GuardedClientRoute({ children }: { children: ReactNode }) {
  const { user } = useStore();
  // If not logged in, render the login form directly
  if (!user) {
    return (
      <Suspense fallback={<PersianLoading />}>
        <LoginRegister />
      </Suspense>
    );
  }
  return <>{children}</>;
}

// Admin operator guard
function GuardedAdminRoute({ children }: { children: ReactNode }) {
  const { user } = useStore();
  if (!user) {
    return <Navigate to="/account" replace />;
  }
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<PersianLoading />}>
            <Routes>
              {/* Public Storefront Route Tree */}
              <Route path="/" element={<CatalogHome />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/dev/ui" element={<UiPlayground />} />

              {/* Client Area Route Tree - Guarded */}
              <Route 
                path="/account/*" 
                element={
                  <GuardedClientRoute>
                    <Routes>
                      <Route path="/" element={<AccountDashboard />} />
                    </Routes>
                  </GuardedClientRoute>
                } 
              />

              {/* Admin Panel Route Tree - Guarded */}
              <Route 
                path="/admin/*" 
                element={
                  <GuardedAdminRoute>
                    <Routes>
                      <Route path="/" element={<AdminPanel />} />
                    </Routes>
                  </GuardedAdminRoute>
                } 
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
