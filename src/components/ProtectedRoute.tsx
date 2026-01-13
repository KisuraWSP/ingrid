import { Navigate } from "@solidjs/router"
import type { JSX } from "solid-js"


interface ProtectedRouteProps {
    children: JSX.Element
}

const ProtectedRoute = (props: ProtectedRouteProps) => {
    const token = localStorage.getItem("token")

    if (!token) {
        <Navigate href="/login" />
    }

    return <>{props.children}</>
}

export default ProtectedRoute