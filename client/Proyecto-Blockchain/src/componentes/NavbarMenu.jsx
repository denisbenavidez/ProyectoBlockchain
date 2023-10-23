import Ethereum from "../img/Ethereum.png"
import "../scss/styles.css"
import { MenuResponsivo } from "../elementos/MenuResponsivo";
import { Link, Input, Button } from "@nextui-org/react";
import { SearchIcon } from "../elementos/SearchIcon.jsx";
import React from "react";
import Saldo from './Saldo.jsx';
import { useAuth } from "../context/AuthContext";

// Importamos el hook useWallet desde el archivo WalletContext para consumir el contexto.
// (acceder a los valores y funciones proporcionados en el).
import { useWallet } from "./WalletContext";


function NavbarMenu() {

  // Utilizamos el hook useWallet() para acceder al contexto WalletContext.
  // que contiene información y funciones relacionadas con la conexión de la wallet.
  const {
    connecting,
    verificacionWallet,
    conectarWallet,
    desconectarWallet,
    isWalletConnected = false // Proporciona un valor predeterminado para isWalletConnected
    // En caso de que useWallet() devuelva undefined (por no estar envuelto en WalletProvider), 
    // usamos un objeto vacío para evitar errores.
  } = useWallet() || {};



  const { isAuthenticated, logout, user } = useAuth();

  return (
    <>
      <header className="header" id="header">
        <nav className="nav container">
          <a href="#" className="nav__logo">DIGITAL MARKETPLACE</a>
          <div className="nav__menu" id="nav-menu">
            <ul className="nav__list">

              {isAuthenticated ? (

                <>
                  <li className="nav__item">
                    Welcome {user.username}
                  </li>
                  <li className="nav__item">
                    <button type="button" className="btn btn-outline-success nav__item"><a href="http://localhost:5173/add-task"><Link to="/add-task">Agregar Producto</Link></a></button>
                  </li>
                  <li className="nav__item">
                    <button type="button" className="btn btn-outline-success nav__item" onClick={() => {
                      logout();
                    }}>Logout</button>
                  </li>

                </>

              ) : (

                <>
                  <li className="nav__item">
                    <button type="button" className="btn btn-outline-primary nav__item"><a href="http://localhost:5173/inicio"><Link to="registro">Entrar</Link></a></button>
                  </li>
                  <li className="nav__item">
                    <button type="button" className="btn btn-outline-success nav__item"><a href="http://localhost:5173/registro"><Link to="registro">Registrarse</Link></a></button>
                  </li>
                </>

              )}


              <li className="nav__item"> {/*Saldo wallet*/}
                <a className="nav__link"><Saldo /></a>
              </li>

              <li className="nav__item"> {/*Input buscador*/}
                <a className="nav__link">
                  <Input classNames={{
                    base: "max-w-full sm:max-w-full h-10",
                    mainWrapper: "h-full",
                    input: "text-small",
                    inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                  }}
                    placeholder="Buscar..."
                    size="sm"
                    startContent={<SearchIcon size={20} />}
                    type="search"
                  /></a>
              </li>
              <li className="nav__item"> {/*Boton conexion wallet*/}

                <a className="nav__link">{verificacionWallet ? (
                  <>{/* conexion wallet */}{/* // Modificación al botón para que muestre "Desconectar Wallet" cuando la wallet está conectada */}
                    {isWalletConnected ? (
                      <Button onClick={desconectarWallet} as={Link} color="warning" href="#" variant="flat">Desconectar Wallet</Button>
                    ) : (
                      <Button
                        onClick={(event) => {
                          // Si el estado 'connecting' es 'false' y el estado 'isWalletConnected' es 'false',
                          // entonces llamamos a la función 'conectarWallet'.
                          // Si el estado 'connecting' es 'true' o el estado 'isWalletConnected' es 'true',
                          // entonces prevenimos la acción por defecto del evento (navegar al enlace), es decir, el botón se comporta como si estuviera deshabilitado mientras nos estamos conectando a la wallet
                          if (!connecting && !isWalletConnected) {
                            conectarWallet();
                          } else {
                            event.preventDefault();
                          }
                        }}
                        as={Link} color="warning" href="#" variant="flat">Conectar</Button>
                    )}
                  </>
                ) : (
                  <h1>¡Importante! Para comenzar en esta plataforma, es esencial que crees una billetera (wallet) antes de proceder. La billetera te permitirá gestionar y asegurar tus activos de manera segura. No olvides configurar una billetera antes de continuar para asegurarte de que todas tus transacciones estén protegidas. ¡Empieza tu viaje hacia un mundo de posibilidades asegurando tus activos con una billetera adecuada!</h1>
                )}

                </a>
              </li>
            </ul>
            <div className="nav__close" id="nav-close">
              <i className='bx bx-x'></i>
            </div>
          </div>
          <div className="nav__toggle" id="nav-toggle" onClick={MenuResponsivo}> {/*icono menu responsivo*/}
            <i className='bx bx-grid-alt'></i>
          </div>
        </nav>
      </header>
      <main className="main"> {/*Parte del logo flotante*/}
        <section className="home">
          <div className="home__container container">
            <div className="home__data">
              <span className="home__subtitle">Bienvenido</span>
              <h1 className="home__title">¿Estas buscando los mejores activos digitales?</h1>
              <p className="home__description">¡El blockchain esta aqui! <br /> ¡Y tu puedes ser parte de esta nueva era!.</p>
              <a href="#" className="home__button animate__animated animate__backInLeft">Ir a mejores ofertas</a>
            </div>
            <div className="home__img">
              <img src={Ethereum} />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default NavbarMenu