import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const session = await auth()
  const user = session?.user

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Selamat datang, {user?.name || user?.email}!</h1>
      <p className="text-zinc-500">Kamu berhasil masuk ke Ruang.</p>

      <form
        action={async () => {
          "use server"
          await signOut()
        }}
      >
        <Button type="submit" variant="outline">
          Keluar
        </Button>
      </form>
    </div>
  )
}
