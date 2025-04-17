import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "404!" },
  ];
}

export default function NotFound() {
    return (
        <div>
            <h1>Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
        </div>
    )
}