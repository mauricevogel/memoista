import Image from 'next/image'

import { DarkModeToggle } from '@/components/ui/dark-mode-toggle'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Image src="/logo.svg" alt="Memoista Logo" width={150} height={50} priority />
      <DarkModeToggle />
    </main>
  )
}
