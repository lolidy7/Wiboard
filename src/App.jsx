import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Layout from './components/Layout';
import Home from './pages/Home';
import Welcome from './pages/Welcome';
import Detail from './pages/Detail';
import Profile from './pages/Profile';
import Library from './pages/Library';
import EditProfile from './pages/EditProfile';
import Explore from './pages/Explore';
import { ThemeProvider } from './context/ThemeContext';
import AuthMiddleware from "./components/auth/middleware/AuthMiddleware";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFoundPage from "./pages/NotFound";

function App() {
  const router = createBrowserRouter([
    {
      path: "/welcome",
      element: <Welcome />,
    },
    // Public routes without Layout (e.g., /login, /signup)
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    // Public routes with Layout (not protected)
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Welcome />,
        },
        {
          path: "/explore",
          element: <Explore />,
        },
      ],
    },
    // Protected routes with Layout (e.g., /home, /detail/:id, /library)
    {
      path: "/",
      element: <AuthMiddleware />, // Protect these routes
      children: [
        {
          path: "/",
          element: <Layout />, // Apply Layout to these routes
          children: [
            {
              path: "/home",
              element: <Home />,
            },
            {
              path: "/detail/:id", // Dynamic route with an :id parameter
              element: <Detail />,
            },
            {
              path: "/library",
              element: <Library />,
            },
            {
              path: "/profile",
              element: <Profile />,
            },
            {
              path: "/editprofile",
              element: <EditProfile />,
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;