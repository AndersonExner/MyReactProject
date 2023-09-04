import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/componentes";

import { VForm, VTextField, useVForm } from "../../shared/forms";

import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { CidadesServices } from "../../shared/services/api/cidades/CidadeService";

interface IFormDataCidade {
  nome: string;
}

const formValidationSchema: yup.Schema<IFormDataCidade> = yup.object().shape({
  nome: yup.string().required().min(3)
});

export const DetalheDeCidades: React.FC = () => {
  const { id = 'novocadastro' } = useParams<'id'>();
  const navigate = useNavigate();
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (id !== 'novocadastro') {
      setIsLoading(true);

      CidadesServices.getById(Number(id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate('/cidades');
          } else {
            setNome(result.nome);
            formRef.current?.setData(result);
          }
        });
    } else {
      formRef.current?.setData({
        nome: ''
      });
    }
  }, [id]);

  const handleSave = (dados: IFormDataCidade) => {
    formValidationSchema.
      validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);

        if (id === 'novocadastro') {
          CidadesServices
            .create(dadosValidados)
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/cidades');
                } else {
                  navigate(`/cidades/detalhe/${result}`);
                }
              }
            });
        } else {
          CidadesServices
            .updateById(Number(id), { id: Number(id), ...dadosValidados })
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/cidades');
                }
              }
            });
        }
      })
      .catch((errors: yup.ValidationError) => {
        const validationErrors: {[key: string]: string} = {};

        errors.inner.forEach(error => {
          if (!error.path) return;

          validationErrors[error.path] = error.message;
        });

        formRef.current?.setErrors(validationErrors);
      });
  };

  const handleDelete = (id: number) => {
    if (confirm("Excluir registro?")){
      CidadesServices.deleteById(id)
      .then(result => {
        if (result instanceof Error){
          alert(result.message)
        }else{
          alert('Registro excluído com sucesso');
          navigate('/cidades');
        }
      })
    }
  }

  return (

    <LayoutBaseDePagina 
      titulo={id === 'novocadastro' ? "Novo Cadastro de Cidade" : `Editando Cadastro: ${nome}` }
      barraDeFerramentas = {
        <FerramentasDeDetalhe
          textoBotaoNovo="Novo Cadastro"
          mostrarBotaoApagar={id !== 'novocadastro'}
          mostrarBotaoNovo={id !== 'novocadastro'}
          mostrarBotaoSalvarEFechar

          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() =>  navigate('/cidades/detalhe/novocadastro')}
          aoClicarEmVoltar={() => navigate('/cidades')}
        />
      }
    >

      <VForm ref={formRef} onSubmit={handleSave}>
        <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">
          
          <Grid container direction="column" padding={2} spacing={2}>

          {(
            isLoading && (
              <Grid item>
                <LinearProgress/>
              </Grid>
            )
          )}

          <Grid item>
            <Typography variant="h5">Informações do Cadastro de Cidade</Typography>
          </Grid>

            <Grid container item direction="row">
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField 
                fullWidth 
                disabled={isLoading} 
                label="Nome"
                placeholder="Nome Cidade" 
                name="nome"
                onChange={e => setNome(e.target.value)} />
              </Grid>
            </Grid>

          </Grid>
        </Box>
      </VForm>

    </LayoutBaseDePagina>


  )
} 