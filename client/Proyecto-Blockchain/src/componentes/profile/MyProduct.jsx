import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import NavbarMenu from "../NavbarMenu";
import { ModalBtn } from "./ModalProfile";

import { useWallet } from '../WalletContext';

const MyProduct = () => {
  const [tokensActivos, setTokensActivos] = useState([]);
  const [tokensInactivos, setTokensInactivos] = useState([]);

  // Usar el hook useWallet para acceder a las funciones y estados del contexto
  const { web3, getActiveTokens, getInactiveTokens, isWalletConnected, contract } = useWallet();

  useEffect(() => {
    async function fetchTokens() {
      if (isWalletConnected) { // Solo intenta obtener tokens si la billetera está conectada
        const activeTokensList = await getActiveTokens();
        const inactiveTokensList = await getInactiveTokens();

        setTokensActivos(activeTokensList);
        setTokensInactivos(inactiveTokensList);
      }
    }

    fetchTokens();
  }, [isWalletConnected]);

  const weiToEther = (weiValue) => {
    return web3.utils.fromWei(weiValue, 'ether');
  };

  const toggleToken = async (tokenId) => {
    try {
      // Obtener la cuenta del usuario
      const accounts = await web3.eth.getAccounts();
      const userAccount = accounts[0];

      // Llamar a la función toggleTokenStatus del contrato
      await contract.methods.toggleTokenStatus(tokenId).send({ from: userAccount });

      // Actualizar la UI o hacer cualquier otra cosa después de la transacción
      // Por ejemplo, puedes volver a obtener la lista de tokens para reflejar el cambio en la UI
      const activeTokensList = await getActiveTokens();
      const inactiveTokensList = await getInactiveTokens();
      setTokensActivos(activeTokensList);
      setTokensInactivos(inactiveTokensList);

    } catch (error) {
      console.error("Error al activar/desactivar el token:", error);
    }
  };


  const changeTokenPrice = async (tokenId, newPriceInEther) => {
    try {
      // Convertir el precio de Ether a Wei
      const newPriceInWei = web3.utils.toWei(newPriceInEther.toString(), 'ether');


      // Obtener la cuenta del usuario
      const accounts = await web3.eth.getAccounts();
      const userAccount = accounts[0];

      // Llamar a la función changePrice del contrato
      await contract.methods.changePrice(tokenId, newPriceInWei).send({ from: userAccount });

      // Actualizar la UI o hacer cualquier otra cosa después de la transacción
      // Por ejemplo, puedes volver a obtener la lista de tokens para reflejar el cambio en la UI
      const activeTokensList = await getActiveTokens();
      const inactiveTokensList = await getInactiveTokens();
      setTokensActivos(activeTokensList);
      setTokensInactivos(inactiveTokensList);

    } catch (error) {
      console.error("Error al cambiar el precio del token:", error);
    }
  };



  const [showCambiarPrecioModal, setShowCambiarPrecioModal] = useState(false);


  const [currentTokenId, setCurrentTokenId] = useState(null);

  const handleOpenCambiarPrecioModal = (tokenId) => {
    setCurrentTokenId(tokenId);
    setShowCambiarPrecioModal(true);
  };

  const handleCloseCambiarPrecioModal = () => {
    setShowCambiarPrecioModal(false);
  };

  const handleGuardarCambiosPrecio = (tokenId) => {
    // Obtén el nuevo precio del campo de entrada (en Ether)
    const nuevoPrecio = document.getElementById("nuevoPrecio").value;

    // Llama a la función para cambiar el precio
    changeTokenPrice(tokenId, nuevoPrecio);

    // Cierra el modal después de guardar los cambios
    handleCloseCambiarPrecioModal();
  };


  return (
    <>
      <NavbarMenu />
      <div className="container">
        <h1 className="mt-4">Mi billetera de tokens</h1>
        <div className="row mt-4">
          <div className="col">
            <h2>Tokens Activos</h2>
            <ul className="list-group">
              {tokensActivos.map(token => (
                <li key={token.tokenId} className="list-group-item d-flex justify-content-between align-items-center">
                  ID: {token.tokenId} - Nombre: {token.name} - Precio: {weiToEther(token.price)} ETH
                  <span>
                    <ModalBtn tokenInfo={token} priceInEther={weiToEther(token.price)} />
                    <button className="btn btn-danger ml-2" onClick={() => toggleToken(token.tokenId)}>Desactivar</button>
                    <button className="btn btn-primary ml-2" onClick={handleOpenCambiarPrecioModal}>Cambiar Precio</button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col">
            <h2>Tokens Inactivos</h2>
            <ul className="list-group">
              {tokensInactivos.map(token => (
                <li key={token.tokenId} className="list-group-item d-flex justify-content-between align-items-center">
                  ID: {token.tokenId} - Nombre: {token.name} - Precio: {weiToEther(token.price)} ETH
                  <span>
                    <ModalBtn tokenInfo={token} priceInEther={weiToEther(token.price)} />
                    <button className="btn btn-success ml-2" onClick={() => toggleToken(token.tokenId)}>Activar</button>
                    <button className="btn btn-primary ml-2" onClick={() => handleOpenCambiarPrecioModal(token.tokenId)}>Cambiar Precio</button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal de ejemplo */}
        <Modal show={showCambiarPrecioModal} onHide={handleCloseCambiarPrecioModal}>
          <Modal.Header closeButton>
            <Modal.Title>Cambiar precio</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label htmlFor="nuevoPrecio">Nuevo Precio:</label>
              <input type="number" className="form-control" id="nuevoPrecio" placeholder="Ingrese el nuevo precio en Ether" />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => handleGuardarCambiosPrecio(currentTokenId)} className="text-dark">
              Guardar Cambio
            </Button>
            <Button variant="secondary" onClick={handleCloseCambiarPrecioModal} className="text-dark">
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default MyProduct;