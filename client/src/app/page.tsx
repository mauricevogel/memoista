import Image from 'next/image'

import { auth } from '@/auth'

export default async function Home() {
  const session = await auth()

  return (
    <main className="flex flex-col">
      <Image src="/logo.svg" alt="Memoista Logo" width={150} height={50} priority />
      <p>Server Component</p>
      <p>{JSON.stringify(session?.user)}</p>

      <a href="/api/auth/signin" className="mt-20 font-bold max-w-fit">
        Login
      </a>
      <a href="/api/auth/signout" className="mt-20 font-bold max-w-fit">
        Signout
      </a>
    </main>
  )
}
