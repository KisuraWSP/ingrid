import "../../App.css"

import { useNavigate } from "@solidjs/router"
import { createSignal, onMount } from "solid-js"

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = createSignal({ name: "User" })

  onMount(() => {
    // Load user data from storage to display their name
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  })

  const handleLogout = () => {
    // 1. Destroy the "ID Card"
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    
    // 2. Go back to login
    navigate("/login")
  };

  return (
    <div class="p-10">
      <h1 class="text-3xl font-bold mb-4">Dashboard</h1>
      <p class="mb-4">Welcome back, <span class="font-bold text-indigo-600">{user().name}</span>!</p>
      
      <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Success! </strong>
        <span class="block sm:inline">You are viewing a protected route.</span>
      </div>

      <button 
        onClick={handleLogout}
        class="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  )
}

export default Dashboard