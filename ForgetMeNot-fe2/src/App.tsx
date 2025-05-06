import {
    HashRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import Layout from './components/Layout.tsx';
import Home from './pages/home';
import About from './pages/about';
import Content from './pages/content';
import Admin from './pages/admin';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/content" element={<Content />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
