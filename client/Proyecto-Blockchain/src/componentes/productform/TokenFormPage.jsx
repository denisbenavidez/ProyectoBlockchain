import NavbarMenu from "../NavbarMenu";
import { useEffect, useState } from 'react';
import { useWallet } from '../WalletContext';
import CreateNFT from "../../img/nft-create.png";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const TokenFormPage = () => {

  const MySwal = withReactContent(Swal);

  const { web3, contract } = useWallet();

  const [name, setName] = useState(''); // Estado para el name
  const [description, setDescription] = useState(''); // Estado para la description
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');


  const tokenizeProduct = async () => {
    if (!web3 || !contract) {
      await MySwal.fire('Atención', 'Por favor, conecta tu wallet primero.', 'warning');
      return;
    }
    try {
      // Convertir el precio de Ether a Wei
      // La función web3.utils.toWei toma una cadena que representa una cantidad en Ether
      // y la convierte a su equivalente en Wei.
      const priceInWei = web3.utils.toWei(price.toString(), 'ether');

      // Llamar al método tokenizeProduct del contrato inteligente
      // Se pasa el productId, el precio convertido a Wei y la URL de la imagen
      await contract.methods
        .tokenizeProduct(name, description, priceInWei, imageUrl,)
        .send({ from: (await web3.eth.getAccounts())[0] }); // Enviar la transacción desde la cuenta conectada

      // Notificar al usuario que el producto fue tokenizado con éxito
      await MySwal.fire('Éxito', 'Producto tokenizado con éxito.', 'success');
    } catch (error) {
      console.error('Error al tokenizar el producto:', error);
    }
  };

  return (
    <>
      <NavbarMenu />
      <section className="bg-white h-screen sectionFondoForm">
        <div className="flex h-[calc(100vh-100px)] items-center justify-center">
          <div className="bg-zinc-900 max-w-md w-full p-12 rounded-md">
            <img className="mx-auto d-block img-fluid" src={CreateNFT} />
            <div>
              <input
                type="text"
                placeholder="Nombre" // Input para el name
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                autoFocus
              />
              <input
                type="text"
                placeholder="Descripción" // Input para la description
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
              />
              <input
                type="number"
                placeholder="Precio en Ethers (pueden ser decimales)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
              />
              <input
                type="text"
                placeholder="URL de la Imagen"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
              />
              <div className="flex justify-center">
                <button className="btn btn-outline-info" onClick={tokenizeProduct}>
                  TOKENIZAR PRODUCTO
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default TokenFormPage;