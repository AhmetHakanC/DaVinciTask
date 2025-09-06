import { useEffect, useState } from 'react'
import type {User} from '../types'
import { getUsers, createUser, updateUser, deleteUser } from '../services/users'
import { getPostsByUser } from '../services/posts'
import {Input} from "postcss";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState<User | null>(null)
    const [postsCount, setPostsCount] = useState<Record<number, number>>({})
    const [draft, setDraft] = useState<Partial<User> | null>(null)

    useEffect(() => {
        (async () => {
            const data = await getUsers()
            setUsers(data)
            setLoading(false)
            const counts: Record<number, number> = {}
            await Promise.all(data.map(async u => {
                const p = await getPostsByUser(u.id)
                counts[u.id] = p.length
            }))
            setPostsCount(counts)
        })()
    }, [])

    async function onCreate(u: Omit<User,'id'>) {
        const optimistic = { id: Date.now(), ...u }
        setUsers(prev => [optimistic, ...prev])
        await createUser(u).catch(() => setUsers(prev => prev.filter(x => x.id !== optimistic.id)))
    }
    async function onUpdate(id:number, patch: Partial<User>) {
        const prev = [...users]
        setUsers(prev => prev.map(u => u.id===id ? { ...u, ...patch } : u))
        await updateUser(id, patch).catch(()=> setUsers(prev))
    }
    async function onDelete(id:number) {
        const prev = [...users]
        setUsers(prev => prev.filter(u => u.id!==id))
        await deleteUser(id).catch(()=> setUsers(prev))
    }

    if (loading) return <div className={"h-screen w-screen flex items-center justify-center text-2xl"}>Loading...</div>
    return (
        <div className={"w-full flex flex-col justify-center items-center py-12 px-36 gap-6"}>
            <div className={"text-2xl select-none"}>Users</div>
            <div className={"text-2xl select-none"}>Total Records: {users.length}</div>
            <div className={"flex flex-col w-full bg-blue-50"}>
                <table className={"w-full border-collapse"}>
                    <thead>
                    <tr className={"bg-blue-200"}>
                        <th className={"border border-gray-300 p-2"}>Index</th>
                        <th className={"border border-gray-300 p-2"}>ID</th>
                        <th className={"border border-gray-300 p-2"}>Name</th>
                        <th className={"border border-gray-300 p-2"}>Username</th>
                        <th className={"border border-gray-300 p-2"}>Email</th>
                        <th className={"border border-gray-300 p-2"}>Posts</th>
                        <th className={"border border-gray-300 p-2"}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((u,index)=>(
                        <tr key={u.id} className={"even:bg-blue-100 border border-gray-300"}>
                            <td className={"border border-gray-300 p-2 text-center"}>
                                {index + 1}
                                {editing?.id === u.id && ' ✏️'}
                            </td>
                            <td className={"border border-gray-300 p-2 text-center"}>{u.id}</td>
                            <td className={"border border-gray-300 p-2"}>
                                {editing?.id === u.id ? (
                                    <input
                                        type="text"
                                        className="w-full border rounded px-2 py-1"
                                        value={draft?.name ?? ''}
                                        onChange={(e) => setDraft(prev => ({ ...(prev ?? {}), name: e.target.value }))}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Escape') { setEditing(null); setDraft(null) }
                                            if (e.key === 'Enter') {
                                                const name = (draft?.name ?? '').trim()
                                                const patch: Partial<User> = {}
                                                if (name && name !== u.name) patch.name = name
                                                if (Object.keys(patch).length) onUpdate(u.id, patch)
                                                setEditing(null); setDraft(null)
                                            }
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    u.name
                                )}
                            </td>
                            <td className={"border border-gray-300 p-2"}>
                                {editing?.id === u.id ? (
                                    <input
                                        type="text"
                                        className="w-full border rounded px-2 py-1"
                                        value={draft?.username ?? ''}
                                        onChange={(e) => setDraft(prev => ({ ...(prev ?? {}), username: e.target.value }))}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Escape') { setEditing(null); setDraft(null) }
                                            if (e.key === 'Enter') {
                                                const name = (draft?.name ?? '').trim()
                                                const username = (draft?.username ?? '').trim()
                                                const email = (draft?.email ?? '').trim()
                                                const patch: Partial<User> = {}
                                                if (name && name !== u.name) patch.name = name
                                                if (username && username !== u.username) patch.username = username
                                                if (email && email !== u.email) patch.email = email
                                                if (Object.keys(patch).length) onUpdate(u.id, patch)
                                                setEditing(null); setDraft(null)
                                            }
                                        }}
                                    />
                                ) : (
                                    u.username
                                )}
                            </td>
                            <td className={"border border-gray-300 p-2"}>
                                {editing?.id === u.id ? (
                                    <input
                                        type="email"
                                        className="w-full border rounded px-2 py-1"
                                        value={draft?.email ?? ''}
                                        onChange={(e) => setDraft(prev => ({ ...(prev ?? {}), email: e.target.value }))}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Escape') { setEditing(null); setDraft(null) }
                                            if (e.key === 'Enter') {
                                                const name = (draft?.name ?? '').trim()
                                                const username = (draft?.username ?? '').trim()
                                                const email = (draft?.email ?? '').trim()
                                                const patch: Partial<User> = {}
                                                if (name && name !== u.name) patch.name = name
                                                if (username && username !== u.username) patch.username = username
                                                if (email && email !== u.email) patch.email = email
                                                if (Object.keys(patch).length) onUpdate(u.id, patch)
                                                setEditing(null); setDraft(null)
                                            }
                                        }}
                                    />
                                ) : (
                                    u.email
                                )}
                            </td>
                            <td className={"border border-gray-300 p-2 text-center"}>{postsCount[u.id] ?? 0}</td>
                            <td className={"border-gray-300 p-2 flex justify-center gap-2"}>
                                {editing?.id === u.id ? (
                                    <>
                                        <button
                                            className={"px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition"}
                                            onClick={() => {
                                                const name = (draft?.name ?? '').trim()
                                                const username = (draft?.username ?? '').trim()
                                                const email = (draft?.email ?? '').trim()
                                                const patch: Partial<User> = {}
                                                if (name && name !== u.name) patch.name = name
                                                if (username && username !== u.username) patch.username = username
                                                if (email && email !== u.email) patch.email = email
                                                if (Object.keys(patch).length) onUpdate(u.id, patch)
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
                                    <>
                                        <button
                                            className={"px-4 py-1.5 bg-orange-400 text-white rounded hover:bg-orange-500 transition"}
                                            onClick={() => { setEditing(u); setDraft(u) }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={"px-4 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition"}
                                            onClick={() => {
                                                if (window.confirm('Are you sure?')) onDelete(u.id)
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </>
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
