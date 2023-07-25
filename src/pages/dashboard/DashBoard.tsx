import { FerramentasDeDetalhe } from "../../shared/componentes";
import { LayoutBaseDePagina } from "../../shared/layouts"
import React from "react";


export const Dashboard = () => {

    return(
        <LayoutBaseDePagina titulo="Página Inicial" barraDeFerramentas={(
            <FerramentasDeDetalhe mostrarBotaoSalvarEFechar/>
        )}>
            
        </LayoutBaseDePagina>
    )
}