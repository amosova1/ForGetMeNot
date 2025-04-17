import {useState} from "react";
import Layout from './components/Layout.tsx';
import Home from './pages/home';
import About from "./pages/about";
import Content from "./pages/content";
import Admin from "./pages/admin";

export type Page = "home" | "about" | "content" | "admin";

function App() {
    const [currentPage, setCurrentPage] = useState<Page>("home");

    const renderPage = () => {
        switch (currentPage) {
            case "about":
                return <About/>;
            case "content":
                return <Content/>;
            case "admin":
                return <Admin/>;
            default:
                return <Home/>;
        }
    };

    return (
        <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
            {renderPage()}
        </Layout>
    );
}

export default App;
