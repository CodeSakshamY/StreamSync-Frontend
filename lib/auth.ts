import { lsGet, lsSet } from "./local-store"

type User = { id: string; email: string }
type AuthState = { token: string | null; user: User | null }
const AUTH_KEY = "wp_auth_v1"

export function getAuth(): AuthState {
  return lsGet<AuthState>(AUTH_KEY, { token: null, user: null })
}

export function setAuth(next: AuthState) {
  lsSet<AuthState>(AUTH_KEY, next)
}

export function getUser(): User | null {
  return getAuth().user
}

export async function loginWithPassword(email: string, _password: string) {
  const token = "mock.jwt.token"
  const user = { id: email, email }
  setAuth({ token, user })
  return { token, user }
}

export async function signupWithPassword(email: string, password: string) {
  return loginWithPassword(email, password)
}

export function logout() {
  setAuth({ token: null, user: null })
}
