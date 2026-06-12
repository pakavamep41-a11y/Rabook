import { lazy, Suspense, ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { useStore } from "./lib/store";
import Layout from "./components/ui/Layout";
import ErrorBoundary from "./components/ui/ErrorBoundary";

// Lazy loading our tree pathways
const CatalogHome = lazy(() => import("./features/catalog/components/CatalogHome"));
const ProductDetail = lazy(() => import("./features/catalog/components/ProductDetail"));
const CartPage = lazy(() => import("./features/catalog/components/CartPage"));
const CheckoutWizard = lazy(() => import("./features/catalog/components/CheckoutWizard"));
const CheckoutSuccess = lazy(() => import("./features/catalog/components/CheckoutSuccess"));
const AccountLayout = lazy(() => import("./features/account/components/AccountLayout"));
const AccountOverview = lazy(() => import("./features/account/components/AccountOverview"));
const OrderList = lazy(() => import("./features/account/components/OrderList"));
const OrderDetail = lazy(() => import("./features/account/components/OrderDetail"));
const LoginRegister = lazy(() => import("./features/account/components/LoginRegister"));
const AdminLayout = lazy(() => import("./features/admin/components/AdminLayout"));
const AdminPanel = lazy(() => import("./features/admin/components/AdminPanel"));
const AdminDashboard = lazy(() => import("./features/admin/components/AdminDashboard"));
const AdminCategoryPage = lazy(() => import("./features/admin/components/AdminCategoryPage"));
const AdminProductList = lazy(() => import("./features/admin/components/AdminProductList"));
const AdminProductEditor = lazy(() => import("./features/admin/components/AdminProductEditor"));
const AdminOrderCreate = lazy(() => import("./features/admin/components/AdminOrderCreate"));
const AdminOrderDetail = lazy(() => import("./features/admin/components/AdminOrderDetail"));
const AdminChats = lazy(() => import("./features/admin/components/AdminChats"));
const AdminCustomers = lazy(() => import("./features/admin/components/AdminCustomers"));
const AdminCustomerDetail = lazy(() => import("./features/admin/components/AdminCustomerDetail"));
const AdminCustomerGroups = lazy(() => import("./features/admin/components/AdminCustomerGroups"));
const AdminPayments = lazy(() => import("./features/admin/components/AdminPayments"));
const AdminDiscounts = lazy(() => import("./features/admin/components/AdminDiscounts"));
const AdminReports = lazy(() => import("./features/admin/components/AdminReports"));
const AdminStaff = lazy(() => import("./features/admin/components/AdminStaff"));
const AdminSettings = lazy(() => import("./features/admin/components/AdminSettings"));
const CMSPageLoader = lazy(() => import("./pages/CMSPageLoader"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const PriceListPage = lazy(() => import("./pages/PriceListPage"));
const BlogListPage = lazy(() => import("./pages/BlogListPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));

const WalletPage = lazy(() => import("./features/account/components/WalletPage"));
const ProfilePage = lazy(() => import("./features/account/components/ProfilePage"));
const AddressBookPage = lazy(() => import("./features/account/components/AddressBookPage"));
const MyDesignsPage = lazy(() => import("./features/account/components/MyDesignsPage"));
const NotificationsPage = lazy(() => import("./features/account/components/NotificationsPage"));
const TicketsPage = lazy(() => import("./features/account/components/TicketsPage"));
const NewTicketPage = lazy(() => import("./features/account/components/NewTicketPage"));
const TicketDetailPage = lazy(() => import("./features/account/components/TicketDetailPage"));
const EditorPage = lazy(() => import("./features/editor/components/EditorPage"));

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
      <span className="text-xs text-slate-500 font-bold">در حال بارگزاری بخش‌های سیستم...</span>
    </div>
  );
}

// Client authentication guard
function GuardedClientRoute({ children }: { children: ReactNode }) {
  const { user } = useStore();
  if (!user) {
    return <Navigate to={`/auth?returnTo=${encodeURIComponent(window.location.pathname + window.location.search)}`} replace />;
  }
  return <>{children}</>;
}

// Admin operator guard
function GuardedAdminRoute({ children }: { children: ReactNode }) {
  const { user } = useStore();
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  if (user.role !== "admin" && user.role !== "staff") {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              {/* Admin Panel Route Tree - Guarded & Uses AdminLayout */}
              <Route 
                path="/admin" 
                element={
                  <GuardedAdminRoute>
                    <AdminLayout />
                  </GuardedAdminRoute>
                } 
              >
                <Route index element={<AdminDashboard />} />
                <Route path="orders" element={<AdminPanel />} />
                <Route path="orders/new" element={<AdminOrderCreate />} />
                <Route path="orders/:id" element={<AdminOrderDetail />} />
                <Route path="chats" element={<AdminChats />} />
                <Route path="categories" element={<AdminCategoryPage />} />
                <Route path="products" element={<AdminProductList />} />
                <Route path="products/new" element={<AdminProductEditor />} />
                <Route path="products/:id" element={<AdminProductEditor />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="customers/groups" element={<AdminCustomerGroups />} />
                <Route path="customers/:id" element={<AdminCustomerDetail />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="discounts" element={<AdminDiscounts />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="staff" element={<AdminStaff />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>

              {/* Editor Route Tree - Runs independent of Layout */}
              <Route 
                path="/editor/:productId" 
                element={
                  <GuardedClientRoute>
                    <Suspense fallback={<PersianLoading />}>
                      <EditorPage />
                    </Suspense>
                  </GuardedClientRoute>
                } 
              />

              {/* Public & Customer Route Tree - Uses Main Layout */}
              <Route 
                path="*" 
                element={
                  <Layout>
                    <Suspense fallback={<PersianLoading />}>
                      <Routes>
                        {/* CMS Public Storefront Route Tree */}
                        <Route path="/" element={<CMSPageLoader defaultSlug="home" />} />
                        <Route path="/p/:slug" element={<CMSPageLoader />} />
                        
                        {/* Catalog & eCommerce */}
                        <Route path="/catalog" element={<CatalogHome />} />
                        <Route path="/c/:slug" element={<CategoryPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/price-list" element={<PriceListPage />} />
                        <Route path="/blog" element={<BlogListPage />} />
                        <Route path="/blog/:slug" element={<BlogDetailPage />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutWizard />} />
                        <Route path="/checkout/success" element={<CheckoutSuccess />} />
                        <Route path="/auth" element={<LoginRegister />} />
                        <Route path="/dev/ui" element={<UiPlayground />} />

                        {/* Client Area Route Tree - Guarded */}
                        <Route 
                          path="/account" 
                          element={
                            <GuardedClientRoute>
                              <AccountLayout />
                            </GuardedClientRoute>
                          } 
                        >
                          <Route index element={<AccountOverview />} />
                          <Route path="orders" element={<OrderList />} />
                          <Route path="orders/:id" element={<OrderDetail />} />
                          <Route path="wallet" element={<WalletPage />} />
                          <Route path="profile" element={<ProfilePage />} />
                          <Route path="addresses" element={<AddressBookPage />} />
                          <Route path="designs" element={<MyDesignsPage />} />
                          <Route path="notifications" element={<NotificationsPage />} />
                          <Route path="tickets" element={<TicketsPage />} />
                          <Route path="tickets/new" element={<NewTicketPage />} />
                          <Route path="tickets/:id" element={<TicketDetailPage />} />
                          <Route path="*" element={<Navigate to="/account" replace />} />
                        </Route>

                        {/* Catch-all redirect */}
                        <Route path="*" element={<CMSPageLoader defaultSlug="not-found" />} />
                      </Routes>
                    </Suspense>
                  </Layout>
                }
              />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
