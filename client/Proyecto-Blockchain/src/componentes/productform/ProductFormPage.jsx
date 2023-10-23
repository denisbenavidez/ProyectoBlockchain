import { useForm } from "react-hook-form";
import { useProduct } from "../../context/ProductContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
function ProductFormPage(){

    const {register, handleSubmit} = useForm();
    const {createProduct, getProductOne} = useProduct();
    const navigate = useNavigate();
    const params = useParams();


    useEffect(() => {
        if (params.id){
            getProductOne(params._id);
        }
    }, [])

    

    const onSubmit = handleSubmit((data) => {
        createProduct(data);
        navigate('/tasks');
        
    });


    
    

    return (
        <section className="bg-black h-screen sectionFondoForm">
            <div className="flex h-[calc(100vh-100px)] items-center justify-center">
            <div className="bg-zinc-900 max-w-md w-full p-12 rounded-md">
            <i class="bi bi-archive text-sky-500 text-6xl flex justify-center p-3"></i>
            <form onSubmit={onSubmit}>

                <input type="text" placeholder="titulo"
                {...register('title')}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                autoFocus></input>

                <textarea type="text" rows="3" placeholder="descripción"
                {...register('description')}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"></textarea>
                
                <input type="number" placeholder="precio"
                {...register('price')}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                autoFocus></input>

              <div className="flex justify-around p-2">
                <p>
                  <Link to="/" className="text-sky-500">
                    <i class="bi bi-arrow-return-left text-1xl"></i>Regresar
                  </Link>
                </p>
                <button type="submit" className="text-sky-500">
                  <i class="bi bi-bag-plus-fill text-1xl"></i> Agregar
                </button>
              </div>
            </form>

        </div>
        </div>
        </section>
    )
}

export default ProductFormPage;