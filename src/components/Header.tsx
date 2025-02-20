import { useEffect, useState } from "react";
import IndexCSS from "../../public/styles/index.module.css";
import { useMutation } from '@apollo/client';
import { PLACE_ORDER } from '../queries';

interface HeaderProps {
    category: string;
    setCategory: (category: "all" | "clothes" | "tech") => void;
    toggleWheneAddToCart: boolean;
    itemAdded:boolean
}

interface productsInfo {
    product_id: string;
    name: string;
    price: number;
    image: string;
    category: "all" | "clothes" | "tech";
    size: "XS" | "S" | "M" | "L"
    color: "gray" | "black" | "green"
    quantity: number
}

export default function Header({ category, setCategory, toggleWheneAddToCart, itemAdded }: HeaderProps) {

    const [placeOrder] = useMutation(PLACE_ORDER);
    const [cartProducts, setCartProducts] = useState<productsInfo[]>([]);
    const [showCart, setShowCart] = useState<boolean>(false)

    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          try {
            const cartItems = JSON.parse(storedCart);
            setCartProducts(cartItems);
          } catch (e) {
            console.error("Error parsing cart from localStorage:", e);
          }
        }
        if(itemAdded){
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            setShowCart(true);
        }

    }, [itemAdded, toggleWheneAddToCart]);


    const increaseQuantity = (product: productsInfo) => {
        const storedCart = localStorage.getItem("cart");
        const cart: productsInfo[] = storedCart ? JSON.parse(storedCart) : [];

        const index = cart.findIndex(item => item.product_id === product.product_id && item.color === product.color && item.size === product.size);
        if (index !== -1) {
        cart[index].quantity += 1;
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        setCartProducts(cart);
    };

    const decreaseQuantity = (product: productsInfo) => {
        const storedCart = localStorage.getItem("cart");
        const cart: productsInfo[] = storedCart ? JSON.parse(storedCart) : [];
    
        const index = cart.findIndex(item => item.product_id === product.product_id && item.color === product.color && item.size === product.size);
        if (index !== -1) {
        cart[index].quantity -= 1;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        setCartProducts(cart);
    };

    const handlePlaceOrder = async () => {
        const items = cartProducts.map(product => ({
            productId: product.product_id,
            size: product.size,
            color: product.color,
            quantity: product.quantity
        }));
        
        try {
            await placeOrder({ variables: { items } });
            localStorage.removeItem("cart");
            setCartProducts([]);
            setShowCart(false);
            alert('Order placed successfully!');
        } catch (error) {
            console.error("Error placing order:", error);
            alert('Failed to place order.');
        }
    };

    return(
        <>
        {showCart &&  <div className={`${IndexCSS.overlay}`} onClick={() => setShowCart(false)}></div>}
    <div className={`${IndexCSS.header} w-full flex justify-center items-center`}>
        <div className={`${IndexCSS.headerContent} flex flex-row justify-between items-center`}>
            <div className={`flex flex-row gap-7`}>
                <div><button data-testid={category === 'all' ? "active-category-link" : "category-link"} className={`${category == 'all' ? ' relative text-green-500 uppercase tracking-wide after:content-[""] after:block after:w-full after:h-[2px] after:bg-green-500 after:mt-3 after:scale-x-150 hover:after:scale-x-150 after:transition-transform after:duration-300 ' : 'after:scale-x-0'}`} onClick={()=> setCategory('all')}>all</button></div>
                <div><button data-testid={category === 'clothes' ? "active-category-link" : "category-link"} className={`${category == 'clothes' ? ' relative text-green-500 uppercase tracking-wide after:content-[""] after:block after:w-full after:h-[2px] after:bg-green-500 after:mt-3 after:scale-x-150 hover:after:scale-x-150 after:transition-transform after:duration-300 ' : 'after:scale-x-0'}`} onClick={()=> setCategory('clothes')}>clothes</button></div>
                <div><button data-testid={category === 'tech' ? "active-category-link" : "category-link"} className={`${category == 'tech' ? ' relative text-green-500 uppercase tracking-wide after:content-[""] after:block after:w-full after:h-[2px] after:bg-green-500 after:mt-3 after:scale-x-150 hover:after:scale-x-150 after:transition-transform after:duration-300 ' : 'after:scale-x-0'}`} onClick={()=> setCategory('tech')}>tech</button></div>
            </div>
            <div className={`${IndexCSS.BrandIconDiv}`}>
                <img src="/src/assets/Brand icon.svg" alt="" />
            </div>
            <div className={`flex flex-col`}>
                {cartProducts.length!==0&&<div data-testid="cart-btn" className={`${IndexCSS.cartNumber} cursor-pointer`} onClick={()=> setShowCart(prevValue => !prevValue)}>{cartProducts.length}</div>}
                <img className="cursor-pointer"  onClick={()=> setShowCart(prevValue => !prevValue)} src="/src/assets/Empty Cart.svg" alt="" />
                {showCart && (
                <div className={`${cartProducts.length!==0 ?IndexCSS.showCart  :IndexCSS.showCartEmpty }`}>
                    <div className={`${cartProducts.length!==0 ?IndexCSS.showCartContents  :IndexCSS.showCartContentsEmpty}`}>
                        <div className={`${IndexCSS.myBagCount}`}>My Bag:&nbsp;<span>{cartProducts.length} items</span></div>
                        {cartProducts.map((product) => (
                        <div className={`${IndexCSS.cartCardContainer}`} key={`${product.product_id}-${product.size}-${product.color}`}>
                            <div className={`${IndexCSS.cartCardContents}`}>
                                <div className={`${IndexCSS.cartCardleftPart}`}>
                                    <div className={`${IndexCSS.cartCardName}`}>{product.name}</div>
                                    <div className={`${IndexCSS.cartCardPrice}`}>${product.price}</div>
                                    <div data-testid="cart-item-attribute-size" className={`${IndexCSS.cartCardSizePart}`}>
                                        <div>Size:</div>
                                        <div className={`flex flex-row gap-2`}>
                                        {["XS", "S", "M", "L"].map(size => (
                                            <div 
                                                key={size}
                                                data-testid={`cart-item-attribute-size-${size.toLowerCase()}${product.size === size ? "-selected" : ""}`}
                                                className={`${IndexCSS.sizeBox} ${product.size === size && ' bg-[#2B2B2B] text-white'}`}
                                            >
                                                {size}
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                    <div data-testid="cart-item-attribute-color" className={`flex flex-col items-start gap-2 ml-0.5`}>
                                        <div className={`${IndexCSS.sizeAndColorAndPriceWordCSS}`}>Color:</div>
                                        <div className={`flex flex-row gap-2`}>
                                        {[
                                            { color: "gray", hex: "#D3D2D5" },
                                            { color: "black", hex: "#2B2B2B" },
                                            { color: "green", hex: "#0F6450" }
                                        ].map(({ color, hex }) => (
                                            <div key={color} className={`${IndexCSS.colorChoiceFirstLayer}`}>
                                                <div 
                                                    data-testid={`cart-item-attribute-color-${color}${product.color === color ? "-selected" : ""}`}
                                                    className={`${IndexCSS.colorBox} ${product.color === color ? 'outline-2 outline-[#5ECE7B] outline-offset-1' : ''}`} style={{ backgroundColor: hex }}
                                                ></div>
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                </div>
                                <div className={`${IndexCSS.cartCardMiddlePart} flex flex-col justify-between items-center`}>
                                    <div data-testid="cart-item-amount-increase" className={`cursor-pointer`} onClick={() => increaseQuantity(product)}><img src="../../src/assets/plus-square.svg" alt="" /></div>
                                    <div data-testid="cart-item-amount">{product.quantity}</div>
                                    <div data-testid="cart-item-amount-decrease" className={`cursor-pointer`} onClick={() => decreaseQuantity(product)}><img src="../../src/assets/minus-square.svg" alt="" /></div>
                                </div>
                                <div className={`${IndexCSS.cartCardImage}`}><img className="h-full w-full" src={product.image.replace(/[[\]"]/g, '')} alt="" /></div>
                            </div>
                        </div>
                        ))}
                        <div className={`w-full flex flex-row justify-between`}>
                            <div className={`${IndexCSS.cartTotalWord}`}>Total</div>
                            <div data-testid="cart-total" className={`${IndexCSS.cartTotalPrice}`}>${cartProducts.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2)}</div>
                        </div>
                        <div className={`${IndexCSS.placeOrderButtonDiv}`}>
                            <button onClick={cartProducts.length !== 0 ? handlePlaceOrder : undefined} className={`${cartProducts.length!==0 ? IndexCSS.placeOrderButtonDiv : IndexCSS.placeOrderButtonDivEmpty} w-full h-full cursor-pointer`}>PLACE ORDER</button>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    </div>
    </>
    )
}