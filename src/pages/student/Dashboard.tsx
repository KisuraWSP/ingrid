import "../../App.css"
import { lazy } from "solid-js"


const NavBar = lazy(() => import("../../components/NavBar"))

function Dashboard() {
  return (
    <>
      <NavBar/>
    </>
  )
}

export default Dashboard