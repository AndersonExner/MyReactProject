/* eslint-disable react/react-in-jsx-scope */
import {BrowserRouter} from 'react-router-dom';

import './shared/forms/TraducoesYup';

import { AppRoutes } from './routes';
import { MenuLateral } from './shared/componentes';
import { AppThemeProvider, DrawerProvider  } from './shared/contexts';

export const App = () =>  {
  return (
    <AppThemeProvider>
    <DrawerProvider>  
      <BrowserRouter>

        <MenuLateral>
          <AppRoutes />  
        </MenuLateral> 

      </BrowserRouter>
      </DrawerProvider>  
    </AppThemeProvider>
  );
};