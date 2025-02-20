import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_BY_ID } from "../queries";
import Header from "../components/Header";
import productPageCSS from "../../public/styles/ProductPage.module.css";
import { useProduct } from "../components/ProductContext";
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import parse from 'html-react-parser';

type Category = "all" | "clothes" | "tech";

type productColor = 'gray' | 'black' | 'green';
type productSize = 'XS' | 'S' | 'M' | 'L';

interface Product {
    id: string;
    name: string;
    price: number;
    gallery: string[];
    category: Category;
    description: string;
    inStock: boolean;
    attributes: {
        id: string;
        name: string;
        type: string;
        items: { id: string; displayValue: string; value: string }[];
    }[];
}

interface OrderItem {
    product_id: string;
    name: string;
    price: number;
    image: string;
    size: productSize;
    color: productColor;
    category: Category;
    quantity: number;
}

export default function ProductPage() {
    const { selectedProductId } = useProduct();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [toggleWheneAddToCart, setToggleWheneAddToCart] = useState<boolean>(false);
    const [size, setSize] = useState<productSize>('XS');
    const [color, setColor] = useState<productColor>('gray');
    const [itemAdded, setItemAdded] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const categoryFromQuery = (searchParams.get("category") as "all" | "clothes" | "tech")
    const navigateTo = useNavigate();
    const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID, {
        variables: { id: selectedProductId },
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const product = data?.product as Product;
    const images = product?.gallery || [];

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleAddToCart = () => {
        if (!product) return;

        const orderItem: OrderItem = {
            product_id: product.id,
            name: product.name,
            price: product.price,
            image: product.gallery[0],
            size,
            color,
            category: product.category,
            quantity: 1,
        };

        const storedCart = localStorage.getItem("cart");
        let cart: OrderItem[] = [];
        if (storedCart) {
            try {
                cart = JSON.parse(storedCart);
            } catch (error) {
                console.error("Error parsing cart from localStorage:", error);
                cart = [];
            }
        }

        const existingIndex = cart.findIndex((item) =>
            item.product_id === orderItem.product_id &&
            item.size === orderItem.size &&
            item.color === orderItem.color
        );

        if (existingIndex !== -1) {
            cart[existingIndex].quantity += orderItem.quantity;
        } else {
            cart.push(orderItem);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        setToggleWheneAddToCart(prevValue => !prevValue);
        setItemAdded(true)
    };

    const handleSetCategory = (newCategory: "all" | "clothes" | "tech") => {
        navigateTo(`/?category=${newCategory}`);
    };

    return (
        <div className={` h-full w-full flex-col flex gap-12`}>
            <Header category={categoryFromQuery} setCategory={handleSetCategory} toggleWheneAddToCart={toggleWheneAddToCart} itemAdded={itemAdded} />
            <div className={`w-full justify-center mt-8`}>
                <div className={`${productPageCSS.pageContent}`}>

                    <div data-testid="product-gallery" className={`${productPageCSS.leftPart } flex flex-col gap-4`}>
                    {images.map((img: string, index: number) => (
                            <div key={index} onClick={() => setCurrentImageIndex(index)} className="cursor-pointer">
                                <img src={img} alt={`Thumbnail ${index}`} />
                            </div>
                        ))}
                    </div>

                    <div className={`${productPageCSS.mainImage}`}>
                        <div className={`${productPageCSS.leftRightArrwosDiv}`}>
                            <div className="cursor-pointer">
                                <img src="../../src/assets/Group 1417.svg" onClick={handlePrevImage}  alt="Left Arrow" />
                            </div>
                            <div className="cursor-pointer">
                                <img src="../../src/assets/Group 1420.svg" onClick={handleNextImage} alt="Right Arrow" />
                            </div>
                        </div>
                        <img className="w-full h-full" src={images[currentImageIndex]} alt="" />
                    </div>

                    <div className={`${productPageCSS.rightPart}`}>
                        <div className={`${productPageCSS.rightPartContents} flex flex-col gap-8 ml-12`}>
                            <div className={`${productPageCSS.productName} flex`}>{product?.name}</div>

                            <div className={`flex flex-col items-start gap-2`}>
                                <div className={`${productPageCSS.sizeAndColorAndPriceWordCSS}`}>SIZE:</div>
                                <div data-testid="product-attribute-size" className={`flex flex-row gap-3`}>
                                    <div className={`${productPageCSS.sizeBox} ${size==='XS'&&' bg-[#2B2B2B] text-white'}`} onClick={()=>setSize('XS')}>XS</div>
                                    <div className={`${productPageCSS.sizeBox} ${size==='S'&&' bg-[#2B2B2B] text-white'}`} onClick={()=>setSize('S')}>S</div>
                                    <div className={`${productPageCSS.sizeBox} ${size==='M'&&' bg-[#2B2B2B] text-white'}`} onClick={()=>setSize('M')}>M</div>
                                    <div className={`${productPageCSS.sizeBox} ${size==='L'&&' bg-[#2B2B2B] text-white'}`} onClick={()=>setSize('L')}>L</div>
                                </div>
                            </div>

                            <div className={`flex flex-col items-start gap-2`}>
                                <div className={`${productPageCSS.sizeAndColorAndPriceWordCSS}`}>COLOR:</div>
                                <div data-testid="product-attribute-color" className={`flex flex-row gap-2`}>
                                    <div className={`${productPageCSS.colorChoiceFirstLayer}`}><div className={`${productPageCSS.colorBox} bg-[#D3D2D5] ${color == 'gray' && ' outline-2 outline-[#5ECE7B] outline-offset-1'}`} onClick={()=>setColor('gray')}></div></div>
                                    <div className={`${productPageCSS.colorBox} bg-[#2B2B2B] ${color == 'black' && ' outline-2 outline-[#5ECE7B] outline-offset-1'}`} onClick={()=>setColor('black')}></div>
                                    <div className={`${productPageCSS.colorBox} bg-[#0F6450] ${color == 'green' && ' outline-2 outline-[#5ECE7B] outline-offset-1'}`} onClick={()=>setColor('green')}></div>
                                </div>
                            </div>

                            <div className={`flex flex-col items-start gap-4`}>
                                <div className={`${productPageCSS.sizeAndColorAndPriceWordCSS}`}>PRICE:</div>
                                <div className={`${productPageCSS.sizeAndColorAndPriceWordCSS}`}>${product?.price.toFixed(2)}</div>
                            </div>

                            <div className={`${productPageCSS.addToCartButtonDiv}`} onClick={handleAddToCart}>
                                <button data-testid="add-to-cart" className="w-full h-full cursor-pointer">ADD TO CART</button>
                            </div>

                            <div data-testid="product-description" className={`${productPageCSS.underButtonText}`}>{parse(product?.description || "")}</div>

                        </div>
                    </div>

                </div>
            </div>
            
        </div>
    );
}
