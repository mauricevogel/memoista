'use client'

import { Burger, Container, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Image from 'next/image'
import Link from 'next/link'

import { DarkModeToggle } from '@/components/ui/dark-mode-toggle/dark-mode-toggle'

import classes from './marketing-header.module.css'

export const MarketingHeader = () => {
  const [mobileMenuOpen, { toggle }] = useDisclosure(false)

  return (
    <header className={classes.header}>
      <Container size="xl">
        <div className={classes.inner}>
          <Image src="/logo.svg" alt="Memoista" width={125} height={100} />
          <Group gap={5} visibleFrom="sm">
            <Link href="/" className={classes.link}>
              Home
            </Link>
            <Link href="/features" className={classes.link}>
              Features
            </Link>
            <Link href="/about" className={classes.link}>
              About
            </Link>
          </Group>
          <Group gap={5}>
            <DarkModeToggle />
            <Burger opened={mobileMenuOpen} onClick={toggle} size="sm" hiddenFrom="sm" />
          </Group>
        </div>
      </Container>
    </header>
  )
}
