'use client'

import { Burger, Button, Container, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Image from 'next/image'
import Link from 'next/link'

import { DarkModeToggle } from '@/components/ui/dark-mode-toggle/dark-mode-toggle'
import useMemoistaSession from '@/hooks/use-memoista-session'

import { MarketingMobileNavigation } from '../marketing-mobile-navigation/marketing-mobile-navigation'
import classes from './marketing-header.module.css'

const links = [
  { title: 'Home', href: '/' },
  { title: 'Features', href: '/features' },
  { title: 'About', href: '/about' }
]

export const MarketingHeader = () => {
  const [mobileMenuOpen, { toggle }] = useDisclosure(false)
  const { status } = useMemoistaSession()
  const userIsAuthenticated = status === 'authenticated'

  const actionButtons = () => {
    if (userIsAuthenticated) {
      return (
        <Link href="/app">
          <Button variant="default">Go to app</Button>
        </Link>
      )
    }

    return (
      <>
        <Link href="/auth/login">
          <Button variant="default">Login</Button>
        </Link>

        <Link href="/auth/register">
          <Button>Register</Button>
        </Link>
      </>
    )
  }

  return (
    <>
      <header className={classes.header}>
        <Container size="xl">
          <div className={classes.inner}>
            <Link href="/" className={classes.logoLink}>
              <Image src="/logo.svg" alt="Memoista" width={125} height={50} />
            </Link>

            <Group gap={5} visibleFrom="sm">
              {links.map((link) => (
                <Link key={link.title} href={link.href} className={classes.link}>
                  {link.title}
                </Link>
              ))}
            </Group>

            <Group gap={15}>
              <DarkModeToggle />
              <Burger opened={mobileMenuOpen} onClick={toggle} size="sm" hiddenFrom="sm" />
              <Group justify="center" visibleFrom="sm" gap={8}>
                {actionButtons()}
              </Group>
            </Group>
          </div>
        </Container>
      </header>

      <MarketingMobileNavigation
        authenticatedUser={userIsAuthenticated}
        links={links}
        isOpen={mobileMenuOpen}
        onClose={toggle}
      />
    </>
  )
}
