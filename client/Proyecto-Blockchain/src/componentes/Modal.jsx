import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

export function ModalBtn(props) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const {tokenInfo, priceInEther} = props; // Extraemos la información del token específico

  return (
    <>
      <Button onPress={onOpen} radius="full" className="bg-gradient-to-tr from-pink-500 to-purple-500 text-white shadow-lg">Ver mas<i className="bi bi-plus-square-dotted"></i></Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={true}> {/*Propiedades isDimissible permite cerrar el modal si se da esc o con un click fuera de su area*/}
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">TokenId {tokenInfo.tokenId}</ModalHeader>
              <ModalBody>
                        <div className="row gx-4 gx-lg-5 align-items-center">
                            <div className="col-md-6"><img className="card-img-top mb-5 mb-md-0" src={tokenInfo.imageUrl} alt="..." /></div> 
                            <div className="col-md-6">
                                <h2 className="display-6 fw-bolder">NFT</h2>
                                <div className="fs-5 mb-3">
                                    <span>Precio: {priceInEther}</span>
                                </div>
                                <p className="lead">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Explicabo ipsum ducimus natus in vero.</p>
                                <div className="d-flex">
                                <button className="btn btn-outline-dark flex-shrink-0" type="button" onclick=""><i className="bi-cart-fill me-1"></i>Add to cart</button> 
                                </div>
                            </div>
                        </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>Close</Button>
                {/* <Button color="primary" onPress={onClose}>Agregar</Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
