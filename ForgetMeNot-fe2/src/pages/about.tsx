import type { Route } from "./+types/home";
import {AboutPage} from "../components/About";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "About Page" },
        { name: "description", content: "Learn more about our organization" }
    ];
}
export default function About() {
    return <AboutPage></AboutPage>
}