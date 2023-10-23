import React from "react";
import { useWallet } from "./WalletContext";

export default function Conexion() {

    const { balance } = useWallet();

    return(
    <div className="div-prueba">
        <h1 className="text-base text-yellow-400">Saldo:</h1>
        <h1 className="text-base text-blue-600"> {balance != null ? Number(balance).toFixed(3) : " "}ETH</h1>
    </div>
    )
}