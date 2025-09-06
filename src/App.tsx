import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import UsersPage from './pages/UsersPage'
import PostsPage from './pages/PostsPage'

export default function App() {
    return (
        <BrowserRouter>
            <nav className={"flex items-center justify-center gap-4 text-xl font-thin py-4 bg-blue-50 border-b-[1px] border-gray-200"}>
                <Link className={"px-8 py-1.5 bg-cyan-600 text-white rounded "} to="/">Home</Link>
                <Link className={"px-8 py-1.5 bg-cyan-600 text-white rounded "} to="/users">Users</Link>
                <Link className={"px-8 py-1.5 bg-cyan-600 text-white rounded "} to="/posts">Posts</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/posts" element={<PostsPage />} />
            </Routes>
        </BrowserRouter>
    )
}
