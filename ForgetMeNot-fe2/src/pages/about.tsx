import { Helmet } from "react-helmet";
import { AboutPage } from "../components/About";

export default function About() {
    return (
        <>
            <Helmet>
                <title>About Page</title>
                <meta name="description" content="Learn more about our organization" />
            </Helmet>
            <AboutPage />
        </>
    );
}
