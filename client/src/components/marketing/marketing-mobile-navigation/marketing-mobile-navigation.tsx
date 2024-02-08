import { Button, Divider, Drawer, Group } from '@mantine/core'
import Link from 'next/link'

import classes from './marketing-mobile-navigation.module.css'

interface MarketingMobileNavigationProps {
  authenticatedUser: boolean
  links: { title: string; href: string }[]
  isOpen: boolean
  onClose: () => void
}

export const MarketingMobileNavigation = (props: MarketingMobileNavigationProps) => {
  const { authenticatedUser, links, isOpen, onClose } = props

  const actionButtons = () => {
    if (authenticatedUser) {
      return (
        <Link href="/app">
          <Button variant="default" w="100%">
            Go to app
          </Button>
        </Link>
      )
    }

    return (
      <>
        <Link href="/auth/login">
          <Button variant="default" w="100%">
            Login
          </Button>
        </Link>

        <Link href="/auth/register">
          <Button w="100%">Register</Button>
        </Link>
      </>
    )
  }

  return (
    <Drawer
      opened={isOpen}
      onClose={onClose}
      size="100%"
      padding="md"
      hiddenFrom="sm"
      position="right"
      zIndex={100}
      withOverlay={false}
      classNames={{
        inner: classes.drawerInner,
        header: classes.drawerHeader
      }}
    >
      {links.map((link) => (
        <Link key={link.title} href={link.href} className={classes.link}>
          {link.title}
        </Link>
      ))}

      <Divider my="sm" />

      <Group justify="center" grow pb="xl" px="md">
        {actionButtons()}
      </Group>
    </Drawer>
  )
}
