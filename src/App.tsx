import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import '@/index.css';
import LandingPage from '@/screens/home/landingPage';
import Home from '@/screens/home/index';
import { Toaster } from 'sonner';
// import Home from './screens/home/';

const paths = [     
  {         
    path: '/',         
    element: <LandingPage/>
  },
  {       
    path:'/app',       
    element: <Home/>
  },
  {
    path: '*',
    element: <Navigate to="/" />
  }
];
const BrowserRouter = createBrowserRouter(paths);

const App = () => {
    return (
    <MantineProvider>
      <Toaster richColors position="top-right" />
      <RouterProvider router={BrowserRouter}/>
    </MantineProvider>
    )
};

export default App;
