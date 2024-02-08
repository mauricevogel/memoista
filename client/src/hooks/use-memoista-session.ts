import { useSession } from 'next-auth/react'

/**
 * This hook provides a mockable wrapper around the `useSession` hook from `next-auth/react`.
 * This is due to an error that occurs when trying to mock the `useSession` hook directly.
 * TODO: Remove this hook once the issue with mocking `useSession` is resolved.
 */
const useMemoistaSession = () => {
  return useSession()
}

export default useMemoistaSession
