import React from "react";
import { useMemo, useEffect, useState } from "react";
import { Icon, 
  IconButton,
  LinearProgress, 
  Pagination, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableFooter, TableHead, 
  TableRow 
}from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDaListagem } from "../../shared/componentes";
import { userDebounce } from "../../shared/hooks";
import { Enviroment } from "../../shared/environment"; 
import { CidadesServices, IListagemCidade } from "../../shared/services/api/cidades/CidadeService";

export const ListagemDeCidades: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = userDebounce(1000, true );
  const navigate = useNavigate()

  const [rows, setRows] = useState<IListagemCidade[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const busca = useMemo(() => {
    return searchParams.get('busca') || ''
  }, [searchParams])

  const pagina = useMemo(() => {
    return Number(searchParams.get('pagina') || '1')
  }, [searchParams])

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      CidadesServices.getAll(pagina, busca)
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
  }, [busca, pagina])

  const handleDelete = (id: number) => {
    if (confirm("Excluir registro?")){
      CidadesServices.deleteById(id)
      .then(result => {
        if (result instanceof Error){
          alert(result.message)
        }else{
          setRows(oldRows => {
            return [
              ...oldRows.filter(oldRow => oldRow.id !== id),
            ]
          })
          alert('Registro excluido com sucesso')
        }
      })
    }
  }

  return (
    <LayoutBaseDePagina 
    titulo="Listagem de Cidades" 
    barraDeFerramentas={
      <FerramentasDaListagem 
        mostrarInputDeBusca
        textoBotaoNovo="Novo Cadastro"
        aoClicarEmNovo={() => navigate('/cidades/detalhe/novocadastro')}
        textoBusca={searchParams.get('busca') ?? ''}
        aoMudarTextoDeBusca={texto => setSearchParams({busca: texto, pagina: '1'}, {replace: true})}
      />
      }
    >

    <TableContainer component={Paper} variant="outlined" sx={{ m:1, width: 'auto' }}>
      <Table>

        <TableHead>
          <TableRow>
            <TableCell width={100}>Ações</TableCell>
            <TableCell>Nome Cidade</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell>
                <IconButton size="small" onClick={() => handleDelete(row.id)}>
                  <Icon>delete</Icon>
                </IconButton>
                <IconButton size="small" onClick={() => navigate(`/cidades/detalhe/${row.id}`)}>
                  <Icon>edit</Icon>
                </IconButton>
              </TableCell>
              <TableCell>{row.nome}</TableCell>
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
          </TableRow>
        )}

        {(totalCount > 0 && totalCount > Enviroment.LIMITE_DE_LINHAS) && (
          <TableRow>
            <TableCell colSpan={3}>
                <Pagination 
                  page={pagina}
                  count={Math.ceil(totalCount / Enviroment.LIMITE_DE_LINHAS)}
                  onChange={(e, newPage) => setSearchParams({busca, pagina: newPage.toString() }, {replace: true})}
                />
            </TableCell>
          </TableRow>
        )}
        </TableFooter>

      </Table>
    </TableContainer>  

    </LayoutBaseDePagina>
  )
}