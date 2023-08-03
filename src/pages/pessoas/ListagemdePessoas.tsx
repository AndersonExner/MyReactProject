import React from "react";
import { useMemo, useEffect, useState } from "react";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDaListagem } from "../../shared/componentes";
import { useSearchParams } from "react-router-dom";
import { IListagemPessoa, pessoasService } from "../../shared/services/api/pessoas/PessoasService";
import { userDebounce } from "../../shared/hooks";
import { LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { Enviroment } from "../../shared/environment";

export const ListagemDePessoas: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = userDebounce(1000, true );

  const [rows, setRows] = useState<IListagemPessoa[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const busca = useMemo(() => {
    return searchParams.get('busca') || ''
  }, [searchParams])

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      pessoasService.getAll(1, busca)
      .then((result) => {
        setIsLoading(false)

        if(result instanceof Error){
          alert(result.message);
          return
        }else{
          setRows(result.data)
          setTotalCount(result.totalCount)
        } 
      });
    });
  }, [busca])

  return (
    <LayoutBaseDePagina 
    titulo="Listagem de Pessoas" 
    barraDeFerramentas={
      <FerramentasDaListagem 
        mostrarInputDeBusca
        textoBotaoNovo="Nova"
        textoBusca={searchParams.get('busca') ?? ''}
        aoMudarTextoDeBusca={texto => setSearchParams({busca: texto}, {replace: true})}
      />
      }
    >

    <TableContainer component={Paper} variant="outlined" sx={{ m:1, width: 'auto' }}>
      <Table>

        <TableHead>
          <TableRow>
            <TableCell>Ações</TableCell>
            <TableCell>Nome Completo</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell>Ações</TableCell>
              <TableCell>{row.nomeCompleto}</TableCell>
              <TableCell>{row.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>

        {totalCount === 0 && !isLoading &&(
          <caption>{Enviroment.LISTAGEM_VAZIA}</caption>
        )}

        <TableFooter>
        {isLoading && (
          <TableRow>
            <TableCell colSpan={3}>
                <LinearProgress variant="indeterminate"/>
            </TableCell>
          </TableRow>)}
        </TableFooter>

      </Table>
    </TableContainer>  

    </LayoutBaseDePagina>
  )
}