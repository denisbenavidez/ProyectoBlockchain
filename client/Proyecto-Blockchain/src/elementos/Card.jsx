import React from "react";
import { Button } from "@nextui-org/react";
import { ModalBtn } from "../componentes/Modal";
import Web3 from "web3";
import { useWallet } from '../componentes/WalletContext';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export function Card() {

    const MySwal = withReactContent(Swal);

    const { web3Infura, listarInformacionTokens, contract, web3 } = useWallet(); // Accede a web3 y listarInformacionTokens desde el contexto

    // ------- Funcion que permite llamar a la funcion de comprar nft en el smart contract ------

    const handlePurchase = async (tokenId, priceInEther) => {
        // Verificar si la wallet está conectada
        if (!web3 || !contract) {
            await MySwal.fire('Atención', 'Por favor, conecta tu wallet antes de continuar.', 'warning');
            return;
        }

        // Mostrar alerta de confirmación
        try {
            
            // Mostrar alerta de confirmación
            const result = await MySwal.fire({
                title: 'Confirmación',
                text: "¿Está seguro de que desea proceder con su compra?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, comprar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                // Si el usuario confirma la compra, proceder con la transacción
                const priceInWei = web3.utils.toWei(priceInEther.toString(), 'ether');
                const accounts = await web3.eth.getAccounts();
                const buyer = accounts[0];

                await contract.methods.purchaseNFT(tokenId).send({ from: buyer, value: priceInWei });

                // Mostrar alerta de éxito
                await MySwal.fire('¡Éxito!', 'NFT adquirido con éxito.', 'success');
            }
        } catch (error) {
            console.error("Error al comprar NFT:", error);
            // Mostrar alerta de error
            await MySwal.fire('Error', 'Hubo un problema al comprar el NFT.', 'error');
        }
    };

    // ------------------------------------------------------------------------------------------


    const Tokens = listarInformacionTokens.map(item => {
        // Convertir el precio de Wei a Ether
        const priceInEther = web3Infura.utils.fromWei(item.price.toString(), 'ether');

        return (
            <div className="card bg-dark" style={{ width: "18rem" }} key={item.tokenId}>
                <img src={item.imageUrl} className="card-img-top" style={{ height: "18rem" }} />
                <div className="card-body card-body-border text-light p-4">
                    <h3 className="card-title text-center">Producto</h3>
                    <div className='flex justify-around m-1'>
                        <h5 className="card-title text-center"> Token Id: {item.tokenId} </h5>
                        <h5 className="card-title text-center"> Precio: {priceInEther} ETH</h5> {/* Muestra el precio en Ether */}
                    </div>
                    <p className="card-text text-justify">
                        Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <div className="verMas-comprar">
                        <Button
                            radius="full"
                            className="bg-gradient-to-tr from-pink-500 to-blue-700 text-white shadow-lg"
                            onClick={() => handlePurchase(item.tokenId, priceInEther)}
                        > Comprar <i className="bi bi-cart4"></i></Button>
                        <ModalBtn tokenInfo={item} priceInEther={priceInEther} />
                    </div>
                </div>
            </div>
        );
    });

    return (
        <>
            {Tokens}
        </>
    )
}