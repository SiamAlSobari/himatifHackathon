import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Ruang</h1>
        <p className="mt-2 text-zinc-500">
          Platform Pertolongan Pertama Psikologis
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/login">
          <Button variant="outline">Masuk</Button>
        </Link>
        <Link href="/register">
          <Button>Daftar</Button>
        </Link>
      </div>
    </div>
  )
}
