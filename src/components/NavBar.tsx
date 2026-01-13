import { createSignal, onMount } from "solid-js"
import { useNavigate } from "@solidjs/router"

const NavBar = () => {

    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    menuToggle?.addEventListener('click', () => {
        if (mobileMenu?.classList.contains('hidden')) {
            mobileMenu?.classList.remove('hidden')
            mobileMenu?.classList.add('flex')
        } else {
            mobileMenu?.classList.add('hidden')
            mobileMenu?.classList.remove('flex')
        }
    })

    const navigate = useNavigate()
    const [user, setUser] = createSignal({ name: "User" })

    onMount(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
    })

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        
        navigate("/login")
    }

    return(
        <>
            <header class="flex items-center justify-between px-6 py-3 md:py-4 shadow max-w-5xl rounded-full mx-auto w-full bg-white">
                <a href="https://prebuiltui.com">
                    <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/prebuiltuiDummyLogo.svg" />
                </a>
                <nav id="menu" class="max-md:absolute max-md:top-0 max-md:left-0 max-md:overflow-hidden items-center justify-center max-md:h-full max-md:w-0 transition-[width] bg-white/50 backdrop-blur flex-col md:flex-row flex gap-8 text-gray-900 text-sm font-normal">
                    <a class="hover:text-indigo-600" href="#">
                        Products
                    </a>
                    <a class="hover:text-indigo-600" href="#">
                        Customer Stories
                    </a>
                    <a class="hover:text-indigo-600" href="#">
                        Pricing
                    </a>
                    <a class="hover:text-indigo-600" href="#">
                        Docs
                    </a>
                    <button id="closeMenu" class="md:hidden text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </nav>
                <button 
                    onClick={handleLogout}
                    class="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                    Logout
                </button>
            </header>
        </>
    )
}

export default NavBar