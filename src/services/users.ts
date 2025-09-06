import { api } from './api'
import type {User} from '../types'

export const getUsers = () => api.get<User[]>('/users').then(r => r.data)
export const createUser = (u: Omit<User, 'id'>) =>
    api.post<User>('/users', u).then(r => r.data)
export const updateUser = (id: number, u: Partial<User>) =>
    api.put<User>(`/users/${id}`, u).then(r => r.data)
export const deleteUser = (id: number) =>
    api.delete(`/users/${id}`).then(() => true)
