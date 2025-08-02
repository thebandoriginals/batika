import { Suspense, lazy } from 'react';
import Preloader from '../components/preloader';

const Loadable = (Component: any) => (props: any) => (
    <Suspense fallback={<Preloader />}><Component {...props} /></Suspense>
);

export const LandingPage = Loadable(lazy(() => import('../pages/LandingPage')));
export const CategoryPage = Loadable(lazy(() => import('../pages/CategoryPage')));
export const NotFoundPage = Loadable(lazy(() => import('../pages/NotFoundPage')));
export const SingleProductPage = Loadable(lazy(() => import('../pages/SingleProductPage')));
export const ProfilePage = Loadable(lazy(() => import('../pages/ProfilePage')));
export const CartPage = Loadable(lazy(() => import('../pages/CartPage')));
export const SearchPage = Loadable(lazy(() => import('../pages/SearchPage')));
export const CheckoutPage = Loadable(lazy(() => import('../pages/CheckoutPage')));
export const SingleOrderPage = Loadable(lazy(() => import('../pages/SingleOrderPage')));

export const LoginPage = Loadable(lazy(() => import('../pages/auth/LoginPage')));
export const RegisterPage = Loadable(lazy(() => import('../pages/auth/RegisterPage')));

export const AdminPage = Loadable(lazy(() => import('../pages/admin/AdminPage')));
export const AdminCategoriesPage = Loadable(lazy(() => import('../pages/admin/AdminCategoriesPage')));
export const AdminProductsPage = Loadable(lazy(() => import('../pages/admin/AdminProductsPage')));
export const AdminOrdersPage = Loadable(lazy(() => import('../pages/admin/AdminOrdersPage')));
export const AdminSingleOrderPage = Loadable(lazy(() => import('../pages/admin/AdminSingleOrderPage')));
