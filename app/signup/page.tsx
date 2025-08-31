import Navbar from "@/components/navbar"
import AuthForm from "@/components/auth-form"

export default function Page() {
  return (
    <main>
      <Navbar />
      <AuthForm mode="signup" />
    </main>
  )
}
