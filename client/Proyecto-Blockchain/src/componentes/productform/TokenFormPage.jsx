import NavbarMenu from "../NavbarMenu";
import { useEffect, useState } from 'react';
import { useWallet } from '../WalletContext';

    const TokenFormPage = () => {
      const { web3, contract } = useWallet();

        const [productId, setProductId] = useState('');
        const [price, setPrice] = useState('');
        const [imageUrl, setImageUrl] = useState('');
        const [tokenId, setTokenId] = useState('');
        const [purchaseAmount, setPurchaseAmount] = useState('');
        const [newPrice, setNewPrice] = useState('');
      
        const tokenizeProduct = async () => {
          if (!web3 || !contract) {
              alert('Conécta tu wallet primero usando el botón en el menú.');
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
                  .tokenizeProduct(productId, priceInWei, imageUrl)
                  .send({ from: (await web3.eth.getAccounts())[0] }); // Enviar la transacción desde la cuenta conectada
      
              // Notificar al usuario que el producto fue tokenizado con éxito
              alert('Producto tokenizado con éxito.');
          } catch (error) {
              console.error('Error al tokenizar el producto:', error);
          }
      };
      
      
        const purchaseNFT = async () => {
          if (!web3 || !contract) {
            alert('Conéctate a la blockchain primero.');
            return;
          }
          try {
            await contract.methods
              .purchaseNFT(tokenId)
              .send({ from: (await web3.eth.getAccounts())[0], value: purchaseAmount });
            alert('NFT comprado con éxito.');
          } catch (error) {
            console.error('Error al comprar el NFT:', error);
          }
        };
      
        const changePrice = async () => {
          if (!web3 || !contract) {
            alert('Conéctate a la blockchain primero.');
            return;
          }
          try {
            const newPriceInWei = web3.utils.toWei(newPrice.toString(), 'ether');

            await contract.methods
              .changePrice(tokenId, newPriceInWei)
              .send({ from: (await web3.eth.getAccounts())[0] });
            alert('Precio cambiado con éxito.');
          } catch (error) {
            console.error('Error al cambiar el precio:', error);
          }
        };

    return (
        <>
        <NavbarMenu/>
        <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">

            <div className="App">
            <h1>Interactuar con el Contrato</h1>
            <div>
                <h2>Tokenizar Producto</h2>
                <input
                type="text"
                placeholder="ID del Producto"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                />
                <input
                type="text"
                placeholder="Precio en Ethers"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                />
                <input
                type="text"
                placeholder="URL de la Imagen"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                />
                <button onClick={tokenizeProduct}>Tokenizar Producto</button>
            </div>
            <div>
                <h2>Comprar NFT</h2>
                <input
                type="text"
                placeholder="ID del Token"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                />
                <input
                type="text"
                placeholder="Cantidad a Pagar en Ethers"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                />
                <button onClick={purchaseNFT}>Comprar NFT</button>
            </div>
            <div>
                <h2>Cambiar Precio</h2>
                <input
                type="text"
                placeholder="ID del Token"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                />
                <input
                type="text"
                placeholder="Nuevo Precio en Ethers"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                />
                <button onClick={changePrice}>Cambiar Precio</button>
            </div>
            </div>

        </div>
        </>
    )
}

export default TokenFormPage;