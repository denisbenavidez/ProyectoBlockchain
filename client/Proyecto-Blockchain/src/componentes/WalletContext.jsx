import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import SmartContractTokenizacion from '../smartContract/tokenizacionDeActivos.json';

// Creación del contexto para la Wallet
// En React, un contexto permite compartir valores entre componentes sin tener que pasar 
// explícitamente props a través de cada nivel del árbol de componentes. 
const WalletContext = createContext();

// Hook personalizado para acceder al contexto de la Wallet en otros componentes.
export function useWallet() {
  return useContext(WalletContext);
}

// Funcion proveedora del contexto de la conexión a la wallet.
export function WalletProvider({ children }) {

  // Estados para gestionar la conexión y datos de la Wallet.
  const [web3, setWeb3] = useState(null);     //guardar instancia de web3
  const [account, setAccount] = useState(null); //guardar cuenta 
  const [balance, setBalance] = useState(null); //guardar el balance
  const [contract, setContract] = useState(null);
  const [verificacionWallet, setVerificacionWallet] = useState(false); //verificacion si tenemos una wallet en el navegador
  // Manejar el estado de conexion de la wallet (reemplazo de ButtonWallet)
  const [isWalletConnected, setIsWalletConnected] = useState(null);

  // Declaramos un nuevo estado llamado 'connecting' que nos ayudará a saber si el proceso de conexión a la billetera está en curso.
  // Inicialmente, este estado es 'false', lo que significa que no hay ninguna conexión en curso.
  const [connecting, setConnecting] = useState(false);


  //---------------------------------------
  const [contractAccessInfura, setContractAccessInfura] = useState(null);
  const [listarInformacionTokens, setListarInformacionTokens] = useState([]);
  const [web3Infura, setWeb3Infura] = useState(null);
  //-------------------------------------------

  const MySwal = withReactContent(Swal);


  //*************** Logica para conectar el smart contract con infura movilizada desde app js ***************
  useEffect(() => {
    // Crear una instancia de Web3 utilizando el proveedor de Infura
    // Esto nos permite interactuar con la blockchain sin necesidad de una wallet
    const web3InfuraConnect = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/50a13d3bc2cd47428ca0ff316d08d90f'));
    setWeb3Infura(web3InfuraConnect);

    // Crear una instancia del contrato
    const contractInstance = new web3InfuraConnect.eth.Contract(
      SmartContractTokenizacion,
      "0xA1E6eE8401610bA8808b1868AF498cC09e124d16"
    );
    // Establecer la instancia del contrato en el estado para que pueda ser utilizada en toda la aplicación
    setContractAccessInfura(contractInstance);
  }, []);

  // -------------------------------
  const ListarTokens = async () => {
    // console.log("contract==>",contract);
    if (contractAccessInfura) {
      try {
        const contadorRegistros = await contractAccessInfura.methods.getTotalTokenizedProducts().call();

        let arrayToken = [];
        for (let i = 1; i <= contadorRegistros; i++) {
          const infotoken = await contractAccessInfura.methods.tokenizedProducts(i).call();
          if (infotoken.categoria != " " && infotoken.isActive) { // Filtrando solo los tokens activos.
            const token = {
              tokenId: infotoken.tokenId,
              price: infotoken.price,
              imageUrl: infotoken.imageUrl
            };
            arrayToken.push(token);
          };
        };
        setListarInformacionTokens(arrayToken);

      } catch (error) {
        console.error('Error al actualizar el valor:', error);
      }
    }
  };
  useEffect(() => { ListarTokens(); }, [contractAccessInfura]);
  // -------------------------------  
  //*************** Fin de la logica movilizada desde app js ***************


  //Funcion para conectar wallet
  const conectarWallet = async () => {
    if (typeof window.ethereum !== 'undefined') { // Verificamos si tenemos metamask
      const web3Instance = new Web3(window.ethereum); //guardamos el obj de eth
      setWeb3(web3Instance);
      // Antes de iniciar el proceso de conexión, establecemos 'connecting' en 'true'.
      // Esto significa que el proceso de conexión a la billetera ha comenzado.
      setConnecting(true);
      try {
        await window.ethereum.enable(); //Solicitamos el acceso a la wallet
        // Obtener la dirección de la cuenta actual
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        // Obtener el saldo de la cuenta
        const balanceWei = await web3Instance.eth.getBalance(accounts[0]);  // Representa el saldo de una cuenta en wei
        const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether'); // Convertir el saldo en wei a ethe
        setBalance(balanceEth);
        // Actualizar el estodo de conexión de la wallet
        setIsWalletConnected(true);
        // ---------------------------------------------
        // Guardar el tiempo actual en el sessionStorage para empezar a contar 1 hora
        // que es el tiempo que se mantendra conectadaa la wallet al menos que se cierre la pestaña o el navegador
        sessionStorage.setItem('walletConnectedTime', Date.now());
        // -------------------------------------------
        const contractInstance = new web3Instance.eth.Contract(
          SmartContractTokenizacion,
          SmartContractTokenizacion && "0xA1E6eE8401610bA8808b1868AF498cC09e124d16"
        ); //crear una instancia
        setContract(contractInstance);
        // llamado de metodos
      } catch (error) {
        console.error(error);
        // Mostrar un mensaje de error en caso de que el usuario rechaze la conexion a la wallet una vez presionado el boton.
        if (error.message.includes('User rejected')) {
          MySwal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Se ha rechazado la conexión'
          });
        } else {
          MySwal.fire({
            icon: 'success',
            title: 'Enhorabuena',
            text: 'Conectado'
          });
        }
      }
      finally {
        setConnecting(false); // Establece connecting en false al final, tanto si la conexión fue exitosa como si hubo un error
      };
    } else {
      setVerificacionWallet(false);
    };
  };

  // Función para desconectar la wallet
  const desconectarWallet = async () => {
    try {
      // Mostramos un mensaje de eleccion para desconectar la wallet
      const result = await MySwal.fire({
        title: '¿Desea desconectar su Wallet actual?',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      });

      // Si el usuario confirma la desconexion, desconectamos la wallet
      if (result.isConfirmed) {
        // Limpiamos el estado de la aplicación
        setWeb3(null);
        setAccount(null);
        setBalance(null);
        setContract(null);
        // Actualizar el estado de conexión de la wallet
        setIsWalletConnected(false);
        // Borrar el tiempo de conexión de la wallet de sessionStorage
        sessionStorage.removeItem('walletConnectedTime');
        // Mostramos un mensaje de éxito
        MySwal.fire({
          icon: 'success',
          title: 'Desconectado',
          text: 'Wallet desconectada'
        });
      }

    } catch (error) {
      console.error(error);
    }
  };

  // Función para comprobar el estado de conexion
  const getAccounts = async () => {
    if (isWalletConnected) {
      console.log('La wallet está conectada a esta aplicación');
    } else {
      console.log('La wallet no está conectada a esta aplicación');
    }
  };

  // useEffect para verificar el estado de la conexion cada vez que cambia isWalletConnected
  useEffect(() => {
    if (isWalletConnected !== null) {
      getAccounts();
    }
  }, [isWalletConnected]);

  // Al recargar la página...
  useEffect(() => {
    // Obtener el tiempo de conexión de la wallet del sessionStorage
    const walletConnectedTime = sessionStorage.getItem('walletConnectedTime');

    // Si ha pasado menos de 1 hora desde que la wallet se conectó por última vez 
    // entonces se reconecta automaticamente al refrescar la pagina.
    if (walletConnectedTime && Date.now() - walletConnectedTime < 1 * 60 * 60 * 1000) {
      // Conectar la wallet
      if (typeof window.ethereum !== 'undefined') {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        window.ethereum.enable().then(async () => {
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
          const balanceWei = await web3Instance.eth.getBalance(accounts[0]);
          const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether');
          setBalance(balanceEth);
          setIsWalletConnected(true);
          const contractInstance = new web3Instance.eth.Contract(
            SmartContractTokenizacion,
            SmartContractTokenizacion && "0xA1E6eE8401610bA8808b1868AF498cC09e124d16"
          );
          setContract(contractInstance);
        });
      } else {
        setVerificacionWallet(false);
      }
    }
  }, []);

  useEffect(() => {
    async function Wallet() { //verificacion si tenemos una wallet disponible
      if (typeof window.ethereum !== 'undefined') {
        setVerificacionWallet(true);
      };
    };
    Wallet();
  }, []);

  return (
    // El componente <WalletContext.Provider> sirve como un contenedor que provee acceso
    // a ciertos valores y funciones a todos los componentes que se encuentren dentro de él.
    // El prop "value" define los datos y funciones que queremos compartir con los componentes descendientes.
    <WalletContext.Provider value={{ isWalletConnected, connecting, account, balance, conectarWallet, desconectarWallet, web3, contract, verificacionWallet, listarInformacionTokens, contractAccessInfura, web3Infura}}>
      {/* Aquí es donde se renderizarán todos los componentes hijos que estén envueltos por el WalletProvider.
        Estos componentes tendrán acceso a todos los valores y funciones definidos en el prop "value" anterior. */}
      {children}
    </WalletContext.Provider>
  );
}

export default WalletProvider;