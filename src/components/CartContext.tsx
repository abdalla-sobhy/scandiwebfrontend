import { createContext, useContext, useState } from "react";

interface productsInfo {
    id: number;
    name: string;
    price: number;
    image: string;
    category: "WOMEN" | "MEN" | "KIDS";
    size: "XS" | "S" | "M" | "L";
    color: "gray" | "black" | "green";
    quantity: number;
}

interface CartContextType {
    cartCount: number;
    cartProducts: productsInfo[];
    addToCart: (product: productsInfo) => void;
    removeFromCart: (productId: number) => void;
    increaseQuantity: (productId: number) => void;
    decreaseQuantity: (productId: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartCount, setCartCount] = useState<number>(0);
    const [cartProducts, setCartProducts] = useState<productsInfo[]>([]);

    const addToCart = (product: productsInfo) => {
        setCartProducts((prev) => {
            const existingProduct = prev.find((p) => p.id === product.id);
            if (existingProduct) {
                return prev.map((p) =>
                    p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
                );
            } else {
                return [...prev, { ...product, quantity: 1 }];
            }
        });
        setCartCount((prev) => prev + 1);
    };

    const removeFromCart = (productId: number) => {
        setCartProducts((prev) => prev.filter((p) => p.id !== productId));
        setCartCount((prev) => prev - 1);
    };

    const increaseQuantity = (productId: number) => {
        setCartProducts((prev) =>
            prev.map((p) =>
                p.id === productId ? { ...p, quantity: p.quantity + 1 } : p
            )
        );
    };

    const decreaseQuantity = (productId: number) => {
        setCartProducts((prev) => {
            const updatedProducts = prev.map((p) =>
                p.id === productId ? { ...p, quantity: p.quantity - 1 } : p
            );
            return updatedProducts.filter((p) => p.quantity > 0);
        });
    };

    return (
        <CartContext.Provider
            value={{
                cartCount,
                cartProducts,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};