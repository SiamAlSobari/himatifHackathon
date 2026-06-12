import { RegisterForm } from "./register-form"

export default function RegisterPage() {
  return (
    <div className="w-full max-w-sm space-y-6 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Daftar ke Ruang</h1>
        <p className="mt-1 text-sm text-zinc-500">Mulai perjalananmu</p>
      </div>
      <RegisterForm />
    </div>
  )
}
