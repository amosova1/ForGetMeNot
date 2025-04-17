// src/pages/index.ts
import Home from "./pages/home";
import About from "./pages/about";
import Content from "./pages/content";
import Admin from "./pages/admin";

export const routes = {
    home: Home,
    about: About,
    content: Content,
    admin: Admin,
} as const;

export type RouteKey = keyof typeof routes;
