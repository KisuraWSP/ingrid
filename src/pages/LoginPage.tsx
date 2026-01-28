import '../App.css'
import { useNavigate } from '@solidjs/router'
import { createSignal } from 'solid-js'
import axios from 'axios'

/**
 * This is the entry point of the program
 * The program will render a login form in which the user can input their username and password
 * There are also buttons to sign in with Google and GitHub
 * Finally, there is a link to create a new account
 */
function LoginPage() {
  const navigate = useNavigate()

  const gotoRegisterPage = () => {
    navigate('/register')
  }

  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [loading, setLoading] = createSignal(false)

  const handleLogin = async (e : Event) => {
    e.preventDefault()
    setLoading(true)

    try {
        const response = await axios.post('http://localhost:5000/login', {
            email : email(),
            password : password()
        })

        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        alert("Login successful!")
        navigate('/home')
    } catch (error) {
        console.error("Login error", error)
        const message = error.response?.data?.message || "Login failed"
        alert(message)
    } finally {
        setLoading(false)
    }
  }

  return (
    <>
      <div>
        <div class="flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div class="text-center sm:mx-auto sm:w-full sm:max-w-md">
                <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">
                    Sign in
                </h1>
            </div>
            <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div class="bg-white dark:bg-gray-700 px-4 pb-4 pt-8 sm:rounded-lg sm:px-10 sm:pb-6 sm:shadow">
                    <form class="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-white">Email address</label>
                            <div class="mt-1">
                                <input id="email" type="text" data-testid="email" required={true} value={email()} onInput={(e) => {setEmail(e.currentTarget.value)}}
                                    class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-300 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm"
                                    placeholder='Enter Email'/>
                            </div>
                        </div>
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-white">Password</label>
                            <div class="mt-1">
                                <input id="password" name="password" type="password" data-testid="password"
                                    autocomplete="current-password" required={true} value={password()} onInput={(e) => {setPassword(e.currentTarget.value)}}
                                    class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-300 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm"
                                    placeholder='Enter Password'/>
                            </div>
                        </div>
                        <div>
                            <button data-testid="login" type="submit"
                                disabled={loading()}
                                class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-700 dark:border-transparent dark:hover:bg-indigo-600 dark:focus:ring-indigo-400 dark:focus:ring-offset-2 disabled:cursor-wait disabled:opacity-50">
                                <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                        aria-hidden="true">
                                        <path fill-rule="evenodd"
                                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                </span>
                                { loading() ? 'Signing in...' : 'Sign in' }
                            </button>
                        </div>
                    </form>
                    <div class="m-auto mt-6 w-fit md:mt-8">
                        <span class="m-auto dark:text-gray-400">Don't have an account?
                            <a class="font-semibold text-indigo-600 dark:text-indigo-100 cursor-pointer hover:underline" onClick={gotoRegisterPage}> Create Account</a>
                        </span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage
