'use client'

import { useState } from 'react'
import { List } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useStrategyStore } from '@/stores/strategyStore'

export default function SessionHistory() {
  const sessionHistory = useStrategyStore((s) => s.sessionHistory)
  const setSessionId = useStrategyStore((s) => s.setSessionId)
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-2 z-20 bg-zinc-800/50 hover:bg-zinc-700"
        >
          <List className="w-5 h-5 text-white" />
          <span className="sr-only">Toggle Sessions</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-60 bg-zinc-900 border-r border-zinc-700 text-white"
      >
        <h3 className="text-lg font-semibold mb-4">Sessions</h3>
        {sessionHistory.length === 0 && (
          <p className="text-zinc-400 text-sm">No sessions</p>
        )}
        {sessionHistory.length > 0 && (
          <ul className="space-y-2">
            {sessionHistory.map((id) => (
              <li key={id}>
                <Button
                  variant="outline"
                  className="w-full justify-start truncate"
                  onClick={() => {
                    setSessionId(id)
                    setOpen(false)
                  }}
                >
                  {id}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </SheetContent>
    </Sheet>
  )
}
