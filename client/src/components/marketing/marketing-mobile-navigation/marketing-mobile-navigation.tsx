import { Button, Divider, Drawer, Group } from '@mantine/core'
import Link from 'next/link'

import classes from './marketing-mobile-navigation.module.css'

interface MarketingMobileNavigationProps {
  links: { title: string; href: string }[]
  isOpen: boolean
  onClose: () => void
}

export const MarketingMobileNavigation = (props: MarketingMobileNavigationProps) => {
  const { links, isOpen, onClose } = props

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
        <Link href="/auth/login">
          <Button variant="default" w="100%">
            Login
          </Button>
        </Link>

        <Link href="/auth/register">
          <Button w="100%">Sign up</Button>
        </Link>
      </Group>
    </Drawer>
  )
}
