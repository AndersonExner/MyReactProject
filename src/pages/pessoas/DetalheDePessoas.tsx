import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/componentes";
import { pessoasService } from "../../shared/services/api/pessoas/PessoasService";
import { VForm, VTextField, useVForm } from "../../shared/forms";

import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";

interface IFormData {
  email: string;
  nomeCompleto: string;
  cidadeId: number;
}

const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
  nomeCompleto: yup.string().required().min(3),
  email: yup.string().required().email(),
  cidadeId: yup.number().required(),
});

export const DetalheDePessoas: React.FC = () => {
  const { id = 'novocadastro' } = useParams<'id'>();
  const navigate = useNavigate();
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (id !== 'novocadastro') {
      setIsLoading(true);

      pessoasService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate('/pessoas');
          } else {
            setNome(result.nomeCompleto);
            formRef.current?.setData(result);
          }
        });
    } else {
      formRef.current?.setData({
        email: '',
        cidadeId: '',
        nomeCompleto: '',
      });
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {
    formValidationSchema.
      validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);

        if (id === 'nova') {
          pessoasService
            .create(dadosValidados)
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/pessoas');
                } else {
                  navigate(`/pessoas/detalhe/${result}`);
                }
              }
            });
        } else {
          pessoasService
            .updateById(Number(id), { id: Number(id), ...dadosValidados })
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/pessoas');
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
      pessoasService.deleteById(id)
      .then(result => {
        if (result instanceof Error){
          alert(result.message)
        }else{
          alert('Registro excluído com sucesso');
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

          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() =>  navigate('/pessoas/detalhe/novocadastro')}
          aoClicarEmVoltar={() => navigate('/pessoas')}
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
            <Typography variant="h5">Informações do Cadastro</Typography>
          </Grid>

            <Grid container item direction="row">
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField 
                fullWidth 
                disabled={isLoading} 
                label="Nome Completo"
                placeholder="Nome Completo" 
                name="nomeCompleto"
                onChange={e => setNome(e.target.value)} />
              </Grid>
            </Grid>

            <Grid container item direction="row">
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField 
                fullWidth 
                disabled={isLoading} 
                label="Email"
                placeholder="Email" 
                name="email" />
              </Grid>
            </Grid>

            <Grid container item direction="row">
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField 
                fullWidth 
                disabled={isLoading} 
                placeholder="Cidade ID" 
                label="Cidade"
                name="cidadeId" />
              </Grid>
            </Grid>

          </Grid>
        </Box>
      </VForm>

    </LayoutBaseDePagina>


  )
} 