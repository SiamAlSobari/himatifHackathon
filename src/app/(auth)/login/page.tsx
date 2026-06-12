import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm space-y-6 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Masuk ke Ruang</h1>
        <p className="mt-1 text-sm text-zinc-500">Lanjutkan perjalananmu</p>
      </div>
      <LoginForm />
    </div>
  )
}
