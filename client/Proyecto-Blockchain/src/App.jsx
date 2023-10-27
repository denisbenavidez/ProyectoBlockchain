import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FormularioInicio from "./componentes/inicio/FormuInicio";
import FormularioRegistro from "./componentes/registro/FormuRegistro";
import DashboardInicio from "./dashboards/DashboardMain";
import { AuthProvider } from "./context/AuthContext";
import ProductsPage from "./componentes/product/ProductsPage";
import ProductFormPage from "./componentes/productform/ProductFormPage";
import { ProductProvider } from "./context/ProductContext";

import MyProduct from "./componentes/profile/MyProduct";

import { useState, useEffect } from "react"
// import Web3 from 'web3';
import SmartContractTokenizacion from './smartContract/tokenizacionDeActivos.json';

import TokenFormPage from "./componentes/productform/TokenFormPage";


// Importamos el componente WalletProvider desde WalletContext.
// WalletProvider es un componente de contexto que proporciona 
// valores y funciones relacionados con la wallet a todos sus componentes hijos.
import WalletProvider from './componentes/WalletContext';

function App() {
  // //----------------------------------------------------------------------------
  // // Estado para almacenar la instancia del contrato
  // const [contract, setContract] = useState(null);
  // const [listarInformacionTokens, setListarInformacionTokens] = useState([]);

  // useEffect(() => {
  //   // Crear una instancia de Web3 utilizando el proveedor de Infura
  //   // Esto nos permite interactuar con la blockchain sin necesidad de una wallet
  //   const web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/50a13d3bc2cd47428ca0ff316d08d90f'));

  //   // Crear una instancia del contrato
  //   const contractInstance = new web3.eth.Contract(
  //     SmartContractTokenizacion,
  //     "0xA1E6eE8401610bA8808b1868AF498cC09e124d16"
  //   );
  //   // Establecer la instancia del contrato en el estado para que pueda ser utilizada en toda la aplicación
  //   setContract(contractInstance);
  // }, []);

  // // -------------------------------
  // const ListarTokens = async () => {
  //   // console.log("contract==>",contract);
  //   if (contract) {
  //     try {
  //       const contadorRegistros = await contract.methods.getTotalTokenizedProducts().call();

  //       let arrayToken = [];
  //       for (let i = 1; i <= contadorRegistros; i++) {
  //         const infotoken = await contract.methods.tokenizedProducts(i).call();
  //         if (infotoken.categoria != " " && infotoken.isActive) { // Filtrando solo los tokens activos.
  //           const token = {
  //             tokenId: infotoken.tokenId,
  //             price: infotoken.price,
  //             imageUrl: infotoken.imageUrl
  //           };
  //           arrayToken.push(token);
  //         };
  //       };
  //       setListarInformacionTokens(arrayToken);

  //     } catch (error) {
  //       console.error('Error al actualizar el valor:', error);
  //     }
  //   }
  // };
  // useEffect(() => { ListarTokens(); }, [contract]);
  // // -------------------------------  
  return (
    <>
    {/* Envuelto por WalletProvider: Este componente proporciona un contexto relacionado con la wallet.
        Cualquier componente hijo dentro de WalletProvider puede acceder a los valores y funciones 
        relacionados con la wallet sin tener que recibirlos explícitamente como props. */}
    <WalletProvider>
    <AuthProvider>
      <ProductProvider>
        <NextUIProvider>
          <Routes>
            <Route path='/' element={<DashboardInicio /*listarInformacionTokens={listarInformacionTokens}*/ />} />
            <Route path='/inicio' element={<FormularioInicio />} />
            <Route path='/registro' element={<FormularioRegistro />} />

            {/* <Route element={<ProtectedRoute />}> */}
              <Route path='/tasks' element={<ProductsPage />} />
              <Route path='/add-task' element={<ProductFormPage />} />
              <Route path='/add-token' element={<TokenFormPage />} />
              <Route path='/tasks/:id' element={<ProductFormPage />} />
              <Route path='/profile' element={<MyProduct />} />

            {/* </Route> */}
          </Routes>
        </NextUIProvider>
      </ProductProvider>
    </AuthProvider>
    </WalletProvider>
    </>
  )
}

export default App
