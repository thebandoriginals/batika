export interface PRODUCT {
    _id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    categories: string[];
    sizes: string[];
    colors: string[];
}

export interface CATEGORY {
    _id: string;
    name: string;
    slug: string;
    image?: string;
}

export interface CART_ITEM {
    _id: string,
    name: string,
    slug: string,
    price: number,
    images: string[],
    quantity: number,
    size?: string,
    color?: string,
}

export interface ORDER {
    _id: string;
    number: number;
    createdAt: Date;
    customer: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    status: string;
    products: CART_ITEM[];
    payment: {
        paid: boolean;
        reference?: string;
        amount: number;
    }
}