import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/componentes";
import { pessoasService } from "../../shared/services/api/pessoas/PessoasService";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import { VTextField } from "../../shared/forms";

interface IFormData {
  email: string;
  nomeCompleto: string;
  cidadeId: number;
}

export const DetalheDePessoas: React.FC = () => {
  const { id = 'novocadastro' } = useParams<'id'>();
  const navigate = useNavigate();

  const formRef = useRef<FormHandles>(null);

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
          formRef.current?.setData(result)
        }
      })
    }
  }, [id])


  const handleSave = (dados: IFormData ) => {
    setIsLoading(true);

    if(id === 'novocadastro'){
      pessoasService
        .create(dados)
        .then((result) => {
          setIsLoading(false);

          if(result instanceof Error){
            alert(result.message);
          } else {
            navigate(`/pessoas/detalhe/${result}`);
          }
        });
    } else {
      pessoasService
        .updateById(Number(id), { id : Number(id), ...dados})
        .then((result) => {
          setIsLoading(false);

          if(result instanceof Error){
            alert(result.message);
          }
        });
    }
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

          aoClicarEmSalvar={() => formRef.current?.submitForm()}
          aoClicarEmSalvarEFechar={() => formRef.current?.submitForm()}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() =>  navigate('/pessoas/detalhe/nova')}
          aoClicarEmVoltar={() => navigate('/pessoas')}
        />
      }
    >

      <Form ref={formRef} onSubmit={handleSave}>
        <VTextField placeholder="Nome Completo" name="nomeCompleto" />
        <VTextField placeholder="Email" name="email" />
        <VTextField placeholder="Cidade ID" name="cidadeId" />
      </Form>

    </LayoutBaseDePagina>


  )
} 