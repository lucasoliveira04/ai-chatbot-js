import {Route, Routes} from "react-router-dom";
import {MainPage} from "../pages/main.jsx";

const routes = [
    {
        path: "/",
        element: <MainPage />,
    }
]

export const AppRouters = () => {
    return(
        <Routes>
            {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
            ))}
        </Routes>
    )
}