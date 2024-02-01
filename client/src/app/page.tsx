import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Image src="/logo.svg" alt="Memoista Logo" width={150} height={50} priority />
      <div>
        <h1>Home</h1>
        <Link href="/about">About</Link>
      </div>
    </main>
  )
}
