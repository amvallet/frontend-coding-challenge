"use client"

import { Alert } from "@chakra-ui/react"

export default function ErrorAlert({ message }: { message: string }) {
  return (
    <Alert.Root status="error" borderRadius="md">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Request failed</Alert.Title>
        <Alert.Description>{message}</Alert.Description>
      </Alert.Content>
    </Alert.Root>
  )
}
