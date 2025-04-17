import { Helmet } from "react-helmet";

export default function NotFound() {
    return (
        <>
            <Helmet>
                <title>New React Router App</title>
                <meta name="description" content="404!" />
            </Helmet>
            <div>
                <h1>Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
            </div>
        </>
    );
}
