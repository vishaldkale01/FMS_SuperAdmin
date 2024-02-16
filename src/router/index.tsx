import { createBrowserRouter } from 'react-router-dom';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import { routes } from './routes';
import LoginCover from '../pages/Authentication/LoginCover';
import LoginBoxed from '../pages/Authentication/LoginBoxed';

const  token = localStorage.getItem('token')
let  isLoggedIn = token === "islogin" ? true : false
const isAuth = (element : JSX.Element , isLoggedIn : Boolean)=>{
return isLoggedIn ?  <DefaultLayout>{element}</DefaultLayout> : < LoginBoxed />

}
const finalRoutes = routes.map((route) => {
    return {
        ...route,
        // element: route.layout === 'blank' ? <BlankLayout>{route.element}</BlankLayout> : <DefaultLayout>{route.element}</DefaultLayout>,
        element: isAuth(route.element, isLoggedIn),
    };
});

const router = createBrowserRouter(finalRoutes);

export default router;
