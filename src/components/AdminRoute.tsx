import { Navigate } from "@solidjs/router";
import type { JSX  } from "solid-js/h/jsx-runtime";

interface AdminRouteProps {
    children : JSX.Element
}

const AdminRoute = (props : AdminRouteProps) => {
    const token = localStorage.getItem("token")

    const userString = localStorage.getItem("user")
    const user = userString ? JSON.parse(userString) : null

    if (!user || !token) {
        return <Navigate href="/login"/>
    }

    if (user.role !== 'admin') {
        return <Navigate href="/home"/>
    }

    return <>{props.children}</>
}

export default AdminRoute