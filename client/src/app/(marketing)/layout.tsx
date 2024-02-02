import '@mantine/core/styles.css'

import { MarketingHeader } from '@/components/marketing/marketing-header/marketing-header'

export default function MarketingLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <MarketingHeader />
      <main>{children}</main>
    </>
  )
}
