/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import { lazy } from 'solid-js'

const App = lazy(() => import('./pages/App'))

const root = document.getElementById('root')

render(() => <App/> , root!)
