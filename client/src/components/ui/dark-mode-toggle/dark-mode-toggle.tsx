import { ActionIcon, Group, useComputedColorScheme, useMantineColorScheme } from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'
import cx from 'clsx'

import classes from './dark-mode-toggle.module.css'

export const DarkModeToggle = () => {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true })

  return (
    <Group justify="center" data-testid="dark-mode-toggle">
      <ActionIcon
        onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
        variant="transparent"
        size="md"
        aria-label="Toggle color scheme"
        color={computedColorScheme === 'light' ? 'black' : 'white'}
        title="Toggle color scheme"
      >
        <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
        <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
      </ActionIcon>
    </Group>
  )
}
