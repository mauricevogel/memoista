import { Alert } from '@mantine/core'

export const FormError = ({ message }: { message?: string }) => {
  if (!message) return null

  return (
    <Alert color="red" variant="filled" radius="md" mb="md">
      {message}
    </Alert>
  )
}
