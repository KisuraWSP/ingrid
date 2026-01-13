import { Router, Route, Navigate } from "@solidjs/router"
import { lazy } from 'solid-js'
import ProtectedRoute from "../components/ProtectedRoute.tsx"

// lazily load the Pages for every route
const LoginPage = lazy(() => import('../pages/LoginPage.tsx'))
const RegisterPage = lazy(() => import('../pages/RegisterPage.tsx'))

// Student Pages
const DashboardPage = lazy(() => import('../pages/student/Dashboard.tsx'))

function App() {
    return(
        <Router>
            <Route path="/" component={() => <Navigate href="/login"/>}/>

            {/* Login System */}
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
    
            {/* Student User Pages */}
            <Route 
                path="/home" 
                component={
                    () => (
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    )
                }
            />
    
            {/* Instructor User Pages */}
    
            {/* Admin User Pages */}
        </Router>
    )
}

export default App