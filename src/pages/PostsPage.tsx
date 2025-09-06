import { useEffect, useState } from 'react'
import type {Post, User} from '../types'
import { getPosts, createPost, updatePost, deletePost } from '../services/posts'
import { getUsers } from '../services/users'

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState<Post | null>(null)
    const [draft, setDraft] = useState<Partial<Post> | null>(null)

    useEffect(() => {
        (async () => {
            const [p, u] = await Promise.all([getPosts(), getUsers()])
            setPosts(p); setUsers(u); setLoading(false)
        })()
    }, [])

    async function onCreate(p: Omit<Post,'id'>) {
        const optimistic = { id: Date.now(), ...p }
        setPosts(prev => [optimistic, ...prev])
        await createPost(p).catch(()=> setPosts(prev => prev.filter(x => x.id !== optimistic.id)))
    }
    async function onUpdate(id:number, patch: Partial<Post>) {
        const prev = [...posts]
        setPosts(prev => prev.map(p => p.id===id ? { ...p, ...patch } : p))
        await updatePost(id, patch).catch(()=> setPosts(prev))
    }
    async function onDelete(id:number) {
        const prev = [...posts]
        setPosts(prev => prev.filter(p => p.id!==id))
        await deletePost(id).catch(()=> setPosts(prev))
    }

    if (loading) return <div className={"h-screen w-screen flex items-center justify-center text-2xl"}>Loading...</div>
    return (
        <div className={"w-full flex flex-col justify-center items-center py-12 px-36 gap-6"}>
            <div className={"text-2xl select-none"}>Posts</div>
            <div className={"text-2xl select-none"}>Total Records: {posts.length}</div>
            <div className={"flex flex-col w-full bg-blue-50"}>
                <table className={"w-full border-collapse"}>
                    <thead>
                    <tr className={"bg-blue-200"}>
                        <th className={"border border-gray-300 p-2"}>Index</th>
                        <th className={"border border-gray-300 p-2"}>ID</th>
                        <th className={"border border-gray-300 p-2"}>User</th>
                        <th className={"border border-gray-300 p-2"}>Title</th>
                        <th className={"border border-gray-300 p-2"}>Body</th>
                        <th className={"border border-gray-300 p-2"}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {posts.map((p, index)=>(
                        <tr key={p.id} className={"even:bg-blue-100 border border-gray-300"}>
                            <td className={"border border-gray-300 p-2 text-center"}>
                                {index + 1}
                                {editing?.id === p.id && ' ✏️'}
                            </td>
                            <td className={"border border-gray-300 p-2 text-center"}>{p.id}</td>
                            <td className={"border border-gray-300 p-2"}>
                                {users.find(u=>u.id===p.userId)?.username ?? p.userId}
                            </td>
                            <td className={"border border-gray-300 p-2"}>
                                {editing?.id === p.id ? (
                                    <input
                                        type="text"
                                        className="w-full border rounded px-2 py-1"
                                        value={draft?.title ?? ''}
                                        onChange={(e) => setDraft(prev => ({ ...(prev ?? {}), title: e.target.value }))}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Escape') { setEditing(null); setDraft(null) }
                                            if (e.key === 'Enter') {
                                                const title = (draft?.title ?? '').trim()
                                                const body = (draft?.body ?? '').trim()
                                                const patch: Partial<Post> = {}
                                                if (title && title !== p.title) patch.title = title
                                                if ((draft?.body ?? '') !== undefined && body !== (p.body ?? '')) patch.body = body
                                                if (Object.keys(patch).length) onUpdate(p.id, patch)
                                                setEditing(null); setDraft(null)
                                            }
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    p.title
                                )}
                            </td>
                            <td className={"border border-gray-300 p-2"}>
                                {editing?.id === p.id ? (
                                    <textarea
                                        className="w-full border rounded px-2 py-1"
                                        rows={2}
                                        value={draft?.body ?? p.body ?? ''}
                                        onChange={(e) => setDraft(prev => ({ ...(prev ?? {}), body: e.target.value }))}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Escape') { setEditing(null); setDraft(null) }
                                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                                const title = (draft?.title ?? '').trim()
                                                const body = (draft?.body ?? '').trim()
                                                const patch: Partial<Post> = {}
                                                if (title && title !== p.title) patch.title = title
                                                if ((draft?.body ?? '') !== undefined && body !== (p.body ?? '')) patch.body = body
                                                if (Object.keys(patch).length) onUpdate(p.id, patch)
                                                setEditing(null); setDraft(null)
                                            }
                                        }}
                                    />
                                ) : (
                                    p.body ?? ''
                                )}
                            </td>
                            <td className={"border-gray-300 p-2 flex flex-col justify-center items-center  gap-2 h-max bg-red-500"}>
                                {editing?.id === p.id ? (
                                    <>
                                        <button
                                            className={"px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition"}
                                            onClick={() => {
                                                const title = (draft?.title ?? '').trim()
                                                const body = (draft?.body ?? '').trim()
                                                const patch: Partial<Post> = {}
                                                if (title && title !== p.title) patch.title = title
                                                if ((draft?.body ?? '') !== undefined && body !== (p.body ?? '')) patch.body = body
                                                if (Object.keys(patch).length) onUpdate(p.id, patch)
                                                setEditing(null); setDraft(null)
                                            }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className={"px-4 py-1.5 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"}
                                            onClick={() => { setEditing(null); setDraft(null) }}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <div className={"flex items-center justify-center h-full gap-2"}>
                                        <button
                                            className={"px-4 py-1.5 bg-orange-400 text-white rounded hover:bg-orange-500 transition"}
                                            onClick={() => { setEditing(p); setDraft({ title: p.title, body: p.body }) }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={"px-4 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition"}
                                            onClick={() => {
                                                if (window.confirm('Are you sure?')) onDelete(p.id).then()
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
