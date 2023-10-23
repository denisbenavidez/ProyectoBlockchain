import {Divider} from "@nextui-org/react";
import Logo from "../img/logo.png";

function Pie() {
  return (
    <>
      <footer>
        <div className="contenedor-footer-up">
          <div className="titulo-footer-1">
            <h2><b>Contactanos en nuestras redes</b></h2>
          </div>
          <div className="iconos-footer">
            <i className="bi bi-instagram icono-red-social"></i>
            <i className="bi bi-facebook icono-red-social"></i>
            <i className="bi bi-github icono-red-social"></i>
            <i className="bi bi-whatsapp icono-red-social"></i>
            <i className="bi bi-envelope-at-fill icono-red-social"></i>
          </div>
        </div>
        <Divider className="my-4" />
        <div className="contenedor-footer-down">
          <div className="body-footer">
            <img src={Logo} className="imagen-logo" />
            <div className="element-footer">
              <h3 className="h3-footer">Marketplace</h3>
              <ul>
                <li><a href="#">Popular collections</a></li>
                <li><a href="#">Launchpad</a></li>
                <li><a href="#">About Launchpad</a></li>
                <li><a href="#">Features Requests</a></li>
              </ul>
            </div>

            <div className="element-footer">
              <h3 className="h3-footer">Resources</h3>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Api</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">System Status</a></li>
              </ul>
            </div>
          </div>
          <Divider className="my-4" />
          <div className="derechos-footer">
            <p>©2023 · Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}


export default Pie