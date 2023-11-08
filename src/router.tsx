import {
    MainPage,
    AddRecipePage,
    AboutRecipePage,
    FavoritesPage,
    AuthorizationPage,
} from './pages';

export const router = [
    {
        path: '/',
        element: <MainPage />,
    },
    {
        path: '/add-recipe',
        element: <AddRecipePage />,
    },
    {
        path: '/favorites',
        element: <FavoritesPage />,
    },
    {
        path: '/about-recepie/:id',
        element: <AboutRecipePage />,
    },
];

export const routerNoLoyout = [
    {
        path: '/auth-register',
        element: <AuthorizationPage register />,
    },
    {
        path: '/auth-login',
        element: <AuthorizationPage login />,
    },
];
