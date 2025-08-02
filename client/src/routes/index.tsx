import { Navigate, useRoutes } from "react-router-dom";
import { AdminCategoriesPage, AdminOrdersPage, AdminProductsPage, AdminSingleOrderPage, CartPage, CategoryPage, CheckoutPage, LandingPage, LoginPage, NotFoundPage, ProfilePage, RegisterPage, SearchPage, SingleOrderPage, SingleProductPage } from "./elements";
import OverallLayout from "../layout";
import { useAuthContext } from "../auth/auth-context";
import Preloader from "../components/preloader";
import AuthGuard from "../auth/AuthGuard";
import RoleBasedGuard from "../auth/RoleBasedGuard";
import AdminLayout from '../layout/admin';

export default function Router () {

    const { isInitialized } = useAuthContext();

    const routes = useRoutes([
        { path: '/', element: <OverallLayout px={0}><LandingPage /></OverallLayout> },
        {
            path: 'auth',
            children: [
                { path: 'login', element: <LoginPage /> },
                { path: 'register', element: <RegisterPage /> },
            ]
        },
        {
            path: 'admin',
            element: <AuthGuard><RoleBasedGuard hasContent roles={['admin']}><AdminLayout /></RoleBasedGuard></AuthGuard>,
            children: [
                { element: <Navigate to='/admin/products' />, index: true },
                { path: 'categories', element: <AdminCategoriesPage /> },
                { path: 'products', element: <AdminProductsPage /> },
                { path: 'orders', element: <AdminOrdersPage /> },
                { path: 'order/:id', element: <AdminSingleOrderPage /> },
            ]
        },
        { path: 'category/:slug', element: <OverallLayout><CategoryPage /></OverallLayout> },
        { path: 'product/:slug', element: <OverallLayout><SingleProductPage /></OverallLayout> },
        { path: 'profile', element: <AuthGuard><OverallLayout><ProfilePage /></OverallLayout></AuthGuard> },
        { path: 'cart', element: <OverallLayout><CartPage /></OverallLayout> },
        { path: 'checkout', element: <AuthGuard><OverallLayout><CheckoutPage /></OverallLayout></AuthGuard> },
        { path: 'order/:id', element: <AuthGuard><OverallLayout><SingleOrderPage /></OverallLayout></AuthGuard> },
        { path: 'search', element: <OverallLayout><SearchPage /></OverallLayout> },
        { path: '404', element: <NotFoundPage /> },
        { path: '*', element: <Navigate to='/404' /> },
    ]);

    if (!isInitialized) return <Preloader />

    return routes;
}