import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/componentes";
import { pessoasService } from "../../shared/services/api/pessoas/PessoasService";
import { LinearProgress } from "@mui/material";


export const DetalheDePessoas: React.FC = () => {
  const { id = 'novocadastro' } = useParams<'id'>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');

  useEffect(() => {
    if(id !== 'novocadastro'){
      setIsLoading(true);

      pessoasService.getById(Number(id))
      .then((result) => {
        setIsLoading(false);

        if(result instanceof Error){
          alert(result.message);
          navigate('/pessoas');
        }else{
          setNome(result.nomeCompleto)
          console.log(result);
        }
      })
    }
  }, [id])


  const handleSave = () => {
    console.log('teste');
    
  }

  const handleDelete = (id: number) => {
    if (confirm("Excluir registro?")){
      pessoasService.deleteById(id)
      .then(result => {
        if (result instanceof Error){
          alert(result.message)
        }else{
          alert('Registro excluido com sucesso');
          navigate('/pessoas');
        }
      })
    }
  }

  return (

    <LayoutBaseDePagina 
      titulo={id === 'novocadastro' ? "Novo Cadastro de Pessoa" : `Editando Cadastro: ${nome}` }
      barraDeFerramentas = {
        <FerramentasDeDetalhe
          textoBotaoNovo="Novo Cadastro"
          mostrarBotaoApagar={id !== 'novocadastro'}
          mostrarBotaoNovo={id !== 'novocadastro'}
          mostrarBotaoSalvarEFechar

          aoClicarEmSalvar={() => handleSave}
          aoClicarEmSalvarEFechar={() => handleSave}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() =>  navigate('/pessoas/detalhe/nova')}
          aoClicarEmVoltar={() => navigate('/pessoas')}
        />
      }
    >

      {isLoading && (
        <LinearProgress variant="indeterminate"/>
      )}
      
    </LayoutBaseDePagina>


  )
} 