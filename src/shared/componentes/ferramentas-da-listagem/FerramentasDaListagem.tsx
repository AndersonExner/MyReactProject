import { Margin } from "@mui/icons-material";
import { Box, Button, Icon, Paper, TextField, useTheme } from "@mui/material"
import React from "react";

interface IFerramentasDaListagemProps{
  textoBusca?: string;
  mostrarInputDeBusca?: boolean;
  aoMudarTextoDeBusca?: (NovoTexto: string) => void;
  textoBotaoNovo?: string;
  mostrarBotaoNovo?: boolean;
  aoClicarEmNovo?: () => void;
}

export const FerramentasDaListagem: React.FC <IFerramentasDaListagemProps> = ({
  textoBusca = '', 
  mostrarInputDeBusca = false,
  aoMudarTextoDeBusca,
  aoClicarEmNovo,
  textoBotaoNovo = 'Novo',
  mostrarBotaoNovo = true,
}) => {
  const theme = useTheme();

  return(
    
    <Box 
      height={theme.spacing(5)}
      marginX={1}
      gap={1}
      padding={1}
      display='flex'
      alignItems='center'
      component={Paper}
    >

      {mostrarInputDeBusca &&(
        <TextField
        size="small"
        value={textoBusca}
        onChange={(e) => aoMudarTextoDeBusca?.(e.target.value)}
        placeholder="Pesquisar..."
      />
      )}

      <Box flex={1} display={'flex'} justifyContent={'end'}>
        {mostrarBotaoNovo &&(
          <Button 
          variant="contained"
          color="primary"
          disableElevation
          onClick={aoClicarEmNovo}
          endIcon={<Icon>add</Icon>}  
        >
          {textoBotaoNovo}
        </Button>
        )}
      </Box>
    </Box>
  )
}