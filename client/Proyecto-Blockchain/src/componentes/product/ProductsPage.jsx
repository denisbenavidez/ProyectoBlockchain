import { useEffect } from "react";
import { useProduct } from "../../context/ProductContext";
import NavbarMenu from "../NavbarMenu";
import ProductCard from "./ProductCard";

function ProductsPage(){

    const { getProduct, product } = useProduct();

    useEffect(() => {
        getProduct()
    }, [])

    if(product.lenght === 0) return (<h1>No task</h1>);

    return (

            <>
                <NavbarMenu/>
            {product.map(product => (
                <ProductCard product={product} key={product._id}/>
            ))}
                
            </>
    );
        
}
export default ProductsPage