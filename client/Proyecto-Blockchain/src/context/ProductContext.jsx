import { createContext, useContext, useState } from "react";
import { createTasksRequest, getTasksRequest, deleteTasksRequest, getTaskRequest } from "../api/product";

const ProductContext = createContext();

export const useProduct = () => {
    const context = useContext(ProductContext);

    if(!context){
        throw new Error("useProducts must be used within a ProductProvider");
    }
    return context;
};

export function ProductProvider({children}) {

    const [product, setProduct] = useState([]);

    const getProduct = async (product) => {
        try{
            const res = await getTasksRequest(product)
        setProduct(res.data)
        }catch(error){
            console.error(error)
        }
    }
    const createProduct = async (product) => {
        const res = await createTasksRequest(product)
        console.log(res);
    };

    const deleteProduct = async (id) => {
        try{
            const res = await deleteTasksRequest(id);
            if(res.status === 204) setProduct(product.filter((product) => product._id !== id));
        }catch(error){
            console.log(error);
        }
    };

    const getProductOne = async (id) => {
        
            const res = await getTaskRequest(id);
            console.log(res);
    };

    return (
        <ProductContext.Provider value={{
            product,
            createProduct,
            getProduct,
            deleteProduct,
            getProductOne,
        }}>
            {children}
        </ProductContext.Provider>
    );
}

