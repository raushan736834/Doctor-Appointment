"use client"

import { Button, For, HStack } from "@chakra-ui/react"
import { toaster } from "@/components/ui/toaster"

const Toast = (title,type,mess) => {
  return (
    <HStack>
      <For each={["success", "error", "info"]}>
        {(type) => (
          <Button
            size="sm"
            variant="outline"
            key={type}
            onClick={() =>
              toaster.create({
                title: {mess},
                type: {type},
              })
            }
          >
            {title}
          </Button>
        )}
      </For>
    </HStack>
  )
}
export default Toast;
