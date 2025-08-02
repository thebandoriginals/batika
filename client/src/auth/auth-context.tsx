import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import localStorageAvailable from "../utils/localStorageAvailable";
import { isValidToken, setSession } from "./token-decoder";
import axiosInstance from "../utils/axios";
import { CART_ITEM, CATEGORY, PRODUCT } from "../types";

const AuthContext = createContext({
    isInitialized: false,
    isAuthenticated: false,
    user: {} as any,
    categories: [] as CATEGORY[],
    products: [] as PRODUCT[],
    cart: [] as CART_ITEM[],
    setCart: (_: CART_ITEM[]) => { },
    manipulateCategory: (_: CATEGORY, method: 'Add' | 'Edit' | 'Delete') => { console.log(method) },
    manageCart: (_: PRODUCT, size: string, color: string, method: 'Add' | 'Remove') => { console.log(size, color, method) },
    manipulateProduct: (_: PRODUCT, method: 'Add' | 'Edit' | 'Delete') => { console.log(method) },
    login: async (data: any) => { console.log(data) },
    register: async (data: any) => { console.log(data) },
    logout: () => {},
    update: (data: any) => { console.log(data) },
});

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('There should include a context');
    return context;
}

const INITIAL_STATE = {
    isInitialized: false,
    isAuthenticated: false,
    user: null,
}

enum dispatchActionTypes { INITIAL = 'INITIAL', LOGIN = 'LOGIN', REGISTER = 'REGISTER', UPDATE = 'UPDATE', LOGOUT = 'LOGOUT' };

interface RF_ACTION {
    type: string,
    payload?: {
        isAuthenticated?: boolean,
        isInitiated?: boolean,
        user?: any
    }
}

const REDUCER_FUNCTION = (state: any, action: RF_ACTION ) => {
    if (action.type === dispatchActionTypes.INITIAL) {
        return {
            isInitialized: true,
            isAuthenticated: action?.payload?.isAuthenticated,
            user: action?.payload?.user
        };
    }
    if (action.type === dispatchActionTypes.LOGIN) {
        return {
            ...state,
            isAuthenticated: true,
            user: action?.payload?.user,
        }
    }
    if (action.type === dispatchActionTypes.REGISTER) {
        return {
            ...state,
            isAuthenticated: true,
            user: action?.payload?.user
        }
    }

    if (action.type === dispatchActionTypes.UPDATE) {
        return {
            ...state,
            user: { ...state?.user, ...action?.payload?.user }
        }
    }

    if (action.type === dispatchActionTypes.LOGOUT) {
        return {
            ...state,
            isAuthenticated: false,
            user: null
        }
    }
}

export default function AuthContextProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(REDUCER_FUNCTION, INITIAL_STATE);
    const [categories, setCategories] = useState<CATEGORY[]>([]);
    const [products, setProducts] = useState<PRODUCT[]>([]);
    const [cart, setCart] = useState<CART_ITEM[]>([]);

    const storageAvailable = localStorageAvailable();

    const getCategories = async () => {
        try {
            const { data } = await axiosInstance.get('/categories');
            setCategories(data.categories);
        } catch (err) {
            console.log(err);
        }
    }

    const manipulateCategory = async (category: CATEGORY, method: 'Add' | 'Edit' | 'Delete') => {
        if (method === 'Add') {
            setCategories(prev => ([category, ...prev]));
        } else if (method === 'Edit') {
            setCategories(prev => {
                return prev.map((each) => {
                    if (each._id === category._id) return { ...each, ...category };
                    return each;
                });
            })
        } else if (method === 'Delete') {
            setCategories(prev => prev.filter(each => each._id !== category._id))
        }
    }

    const getProducts = async () => {
        try {
            const { data } = await axiosInstance.get('/products');
            setProducts(data.products);
        } catch (err) {
            console.log(err);
        }
    }

    const manipulateProduct = async (product: PRODUCT, method: 'Add' | 'Edit' | 'Delete') => {
        if (method === 'Add') {
            setProducts(prev => ([product, ...prev]));
        } else if (method === 'Edit') {
            setProducts(prev => {
                return prev.map((each) => {
                    if (each._id === product._id) return { ...each, ...product };
                    return each;
                });
            })
        } else if (method === 'Delete') {
            setProducts(prev => prev.filter(each => each._id !== product._id))
        }
    }

    const initialize = useCallback(async () => {
        try {
            await getCategories();
            await getProducts();
            const accessToken = storageAvailable ? localStorage.getItem('accessToken'): '';
            if (accessToken && await isValidToken(accessToken)) {
                setSession(accessToken);
                const response = await axiosInstance.get('/auth/profile');
                setCart(response.data?.user?.cart);
                dispatch({ type: dispatchActionTypes.INITIAL, payload: { isAuthenticated: true, user: response.data?.user } })
            } else {
                dispatch({ type: dispatchActionTypes.INITIAL, payload: { isAuthenticated: false, user: null } })
            }
        } catch (error) {
            console.error(error);
            dispatch({ type: dispatchActionTypes.INITIAL, payload: { isAuthenticated: false, user: null } });
        }
    } ,[storageAvailable]);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const login = useCallback(async (data: any) => {
        const response = await axiosInstance.post('/auth/login', data);
        const { user, accessToken } = response.data;
        setCart(user?.cart);
        setSession(accessToken);
        dispatch({ type: dispatchActionTypes.LOGIN, payload: { user } });
    }, []);

    const register = useCallback(async (data: any) => {
        const response = await axiosInstance.post('/auth/register', data);
        const { user, accessToken } = response.data;
        setCart(user?.cart);
        setSession(accessToken);
        dispatch({ type: dispatchActionTypes.REGISTER, payload: { user } });
    }, []);

    const update = useCallback((data: any) => {
        dispatch({ type: dispatchActionTypes.UPDATE, payload: { user: data } });
    }, []);

    const manageCart = async (product: PRODUCT, size: string, color: string, method: 'Add' | 'Remove') => {
        let previousCart = cart;
        if (method === 'Add') {
            const foundItemInCart = cart.find((ci) => ci._id === product._id);
            if (!foundItemInCart) previousCart = [...cart, { _id: product._id, images: product.images, name: product.name, price: product.price, color, size, slug: product.slug, quantity: 1 }];
            else if (foundItemInCart) previousCart = cart.map(it => {
                if (it._id === product._id) return { ...it, quantity: it.quantity + 1, size, color }
                return it;
            })
        } else if (method === 'Remove') {
            const foundItemInCart = cart.find((ci) => ci._id === product._id);
            if (foundItemInCart) {
                if (foundItemInCart.quantity === 1) previousCart = cart.filter(c => c._id !== product._id);
                else if (foundItemInCart.quantity > 1) previousCart = cart.map(each => {
                    if (each._id === product._id) return { ...each, size, color, quantity: each.quantity - 1, }
                    return each
                })
            }
        };
        if (state?.isAuthenticated) {
            await axiosInstance.patch('/user/manage-cart', { cart: previousCart });
            setCart(previousCart);
            update({ cart: previousCart })
        }
    }
    
    const logout = useCallback(() => {
        setSession(null);
        localStorage.removeItem('refreshToken');
        dispatch({ type: dispatchActionTypes.LOGOUT });
    }, []);

    const value = useMemo(() => ({
        isInitialized: state.isInitialized,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        manipulateCategory,
        manipulateProduct,
        categories,
        cart,
        products,
        login,
        register,
        logout,
        update,
        manageCart,
        setCart,
    }), [state.isAuthenticated, state.isInitialized, categories, cart, setCart, products, manageCart, manipulateCategory, manipulateProduct, state.user, login, logout, register, update]);

    return <AuthContext.Provider value={value} >{children}</AuthContext.Provider>
}