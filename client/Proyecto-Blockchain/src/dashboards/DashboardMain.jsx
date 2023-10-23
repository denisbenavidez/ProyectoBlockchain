// Dashboard.js
import React from 'react';
import NavbarMenu from '../componentes/NavbarMenu';
import Cuerpo from '../componentes/Cuerpo';
import Pie from '../componentes/Pie';

function DashboardMain(/*props*/) {
  return (
    <>
    <div>
      <NavbarMenu />
      <Cuerpo /*listarInformacionTokens={props.listarInformacionTokens}*/ />
      <Pie />
    </div>
    </>
  );
}

export default DashboardMain;
