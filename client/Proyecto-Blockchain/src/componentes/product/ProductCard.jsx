import { useProduct } from "../../context/ProductContext";
import { Link } from "react-router-dom";
function ProductCard( { product }) {

    const {deleteProduct} = useProduct();

  return (
    
    <section className="bg-black h-screen sectionFondoForm">
        <div className="flex h-[calc(100vh-100px)] items-center justify-center">
            <div className="bg-zinc-900 max-w-md w-full p-12 rounded-md"> 
                <i class="bi bi-archive text-sky-500 text-6xl flex justify-center p-3"></i>
                <h1 className="text-2xl font-bold text-slate-300 text-center">Producto: {product.title}</h1>
                <p className="text-slate-300 text-center">Descripcion: {product.description}</p>
                <p className="text-slate-300 text-center">Precio: {product.price}</p>       
                <p className="text-center">Fecha de registro: {new Date(product.date).toLocaleDateString()}</p> 
                    <div className="flex justify-content-center gap-4">
                        <button className="text-sky-500" onClick={() => {
                            deleteProduct(product._id);}}><i class="bi bi-trash"></i> Eliminar 
                        </button>
                        <button className="text-sky-500">
                            <Link to={`/tasks/${product._id}`}> <i class="bi bi-pencil-square"></i> Editar</Link>
                        </button>                        
                    </div>     
            </div>
        </div>
    </section>
    
  );
}

export default ProductCard;