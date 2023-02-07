
import { useMediaQuery } from "@mui/material";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import React from "react";
import { useDrawerContext } from "../contexts";

interface ILayoutBaseDePaginaProps {
    children: React.ReactNode;
    titulo: string;
    barraDeFerramentas?: React.ReactNode;

}

export const LayoutBaseDePagina: React.FC<ILayoutBaseDePaginaProps> = ({ titulo, children, barraDeFerramentas }) => {

    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm')); 
    const mdDown = useMediaQuery(theme.breakpoints.down('md'));

    const {toggleDrawerOpen}  = useDrawerContext();

    return (
        <Box height="100%" display="flex" flexDirection="column" gap={1} >
            <Box padding={1} height={theme.spacing(smDown ? 6 : mdDown ? 8 : 12)} display="flex" alignItems={"center"} gap={1}>
                
                {smDown && (
                <IconButton onClick={toggleDrawerOpen}>
                    <Icon>menu</Icon>
                </IconButton>
                )}   

                <Typography 
                    variant={smDown ? "h5" : mdDown ? "h4" : "h3"}
                    whiteSpace={"nowrap"}
                    overflow="hidden"
                    textOverflow={"ellipsis"}
                >  
                    {titulo}
                </Typography>
            </Box>

            {barraDeFerramentas && (<Box>  
                {barraDeFerramentas}
            </Box>)}  
        
            <Box flex={1} overflow={"auto"}>  
                {children}
            </Box>   
        </Box>
    );
};