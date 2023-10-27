import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

export function ModalBtn(props) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const {tokenInfo, priceInEther} = props; // Extraemos la información del token específico

  return (
    <>
      <Button onPress={onOpen} className="btn btn-info">Ver mas</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={true}> {/*Propiedades isDimissible permite cerrar el modal si se da esc o con un click fuera de su area*/}
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">TokenId: {tokenInfo.tokenId}</ModalHeader>
              <ModalBody>
                        <div className="row gx-4 gx-lg-5 align-items-center">
                            <div className="col-md-6"><img className="card-img-top mb-5 mb-md-0" src={tokenInfo.imageUrl} alt="..." /></div> 
                            <div className="col-md-6">
                                <h2 className="display-6 fw-bolder">{tokenInfo.name}</h2>
                                <br/>
                                <div className="fs-5 mb-3">
                                    <span>Precio: {priceInEther} ETH</span>
                                </div>
                                <p className="lead">{tokenInfo.description}</p>
                                <br/>
                                <div className="d-flex">
                                {/* <button className="btn btn-outline-dark flex-shrink-0" type="button" onclick=""><i className="bi-cart-fill me-1"></i>Add to cart</button>  */}
                                </div>
                            </div>
                        </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>Cerrar</Button>
                {/* <Button color="primary" onPress={onClose}>Agregar</Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
