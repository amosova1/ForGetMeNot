import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("about", "./routes/about.tsx"),
    route("content", "./routes/content.tsx"),
    route("admin", "./routes/admin.tsx"),
] satisfies RouteConfig;