import { api } from './api'
import type {Post} from '../types'

export const getPosts = () => api.get<Post[]>('/posts').then(r => r.data)
export const getPostsByUser = (userId: number) =>
    api.get<Post[]>(`/posts?userId=${userId}`).then(r => r.data)
export const createPost = (p: Omit<Post, 'id'>) =>
    api.post<Post>('/posts', p).then(r => r.data)
export const updatePost = (id: number, p: Partial<Post>) =>
    api.put<Post>(`/posts/${id}`, p).then(r => r.data)
export const deletePost = (id: number) =>
    api.delete(`/posts/${id}`).then(() => true)
