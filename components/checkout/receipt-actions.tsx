"use client"

import { useState } from "react"
import { Check, Copy, Printer } from "lucide-react"

interface ReceiptActionsProps {
  sessionId: string
}

export function ReceiptActions({ sessionId }: ReceiptActionsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sessionId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Ignore clipboard write failures
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#1f2937] pt-3 text-xs text-[#9ca3af]">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-white/5 hover:text-white"
        title="Copy session reference ID"
      >
        {copied ? (
          <>
            <Check className="size-3.5 text-emerald-400" />
            <span className="text-emerald-400">Copied</span>
          </>
        ) : (
          <>
            <Copy className="size-3.5" />
            <span>Copy Session ID</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-white/5 hover:text-white"
      >
        <Printer className="size-3.5" />
        <span>Print Receipt</span>
      </button>
    </div>
  )
}
