import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ProductContextType {
    selectedProductId: string | null;
    setSelectedProductId: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
    const [selectedProductId, setSelectedProductId] = useState<string | null>(() => {
        return localStorage.getItem("selectedProductId");
    });

    useEffect(() => {
        if (selectedProductId !== null) {
            localStorage.setItem("selectedProductId", selectedProductId.toString());
        }
    }, [selectedProductId]);

    return (
        <ProductContext.Provider value={{ selectedProductId, setSelectedProductId }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProduct() {
    const context = useContext(ProductContext);
    if (!context) throw new Error("useProduct must be used within a ProductProvider");
    return context;
}
