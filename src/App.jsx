import {AppRouters} from "./router/index.jsx";
import {BrowserRouter, useLocation} from "react-router-dom";
import {useEffect} from "react";
import {Helmet} from "react-helmet";

function App() {
    return (
    <BrowserRouter>
        <AppContent />
    </BrowserRouter>
  )
}

function AppContent(){
    const getPageTitle = () => {
        switch (location.pathname) {
            case "/": return "ChatBot"
            default: return "Error 404"
        }
    }

    return (
        <>
            <Helmet>
                <title>{getPageTitle()}</title>
            </Helmet>
            <AppRouters/>
        </>
    )
}

export default App
