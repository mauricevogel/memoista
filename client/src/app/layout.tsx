import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'

export const metadata: Metadata = {
  title: 'Memoista | Your online memory'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body>
          <ColorSchemeScript defaultColorScheme="auto" />

          <MantineProvider
            defaultColorScheme="auto"
            theme={{
              primaryColor: 'cyan'
            }}
          >
            <Notifications />
            {children}
          </MantineProvider>
        </body>
      </html>
    </SessionProvider>
  )
}
