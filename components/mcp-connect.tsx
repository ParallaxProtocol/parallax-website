"use client"

import { CopyButton } from "@/components/copy-button"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { useState } from "react"

export const MCP_URL = "https://mcp.parallaxprotocol.org/mcp"

type Client = {
  key: string
  name: string
  /** Shown in the code block and copied; omitted for clients set up by hand. */
  snippet?: string
  /** Where the snippet goes, e.g. a config file path. */
  where?: string
}

// How each assistant connects to the public server. All take the same
// Streamable HTTP endpoint; only the place it goes differs. Commands and
// config shapes follow each client's own MCP docs (as of 2026-10).
const CLIENTS: Client[] = [
  { key: "claude", name: "Claude" },
  {
    key: "claudeCode",
    name: "Claude Code",
    snippet: `claude mcp add --transport http parallax ${MCP_URL}`,
  },
  { key: "chatgpt", name: "ChatGPT" },
  {
    key: "cursor",
    name: "Cursor",
    where: "~/.cursor/mcp.json",
    snippet: JSON.stringify({ mcpServers: { parallax: { url: MCP_URL } } }, null, 2),
  },
  {
    key: "vscode",
    name: "VS Code",
    where: ".vscode/mcp.json",
    snippet: JSON.stringify({ servers: { parallax: { type: "http", url: MCP_URL } } }, null, 2),
  },
  {
    key: "gemini",
    name: "Gemini CLI",
    snippet: `gemini mcp add --transport http parallax ${MCP_URL}`,
  },
  {
    key: "codex",
    name: "Codex",
    snippet: `codex mcp add parallax --url ${MCP_URL}`,
  },
  {
    key: "windsurf",
    name: "Windsurf",
    where: "~/.codeium/windsurf/mcp_config.json",
    snippet: JSON.stringify({ mcpServers: { parallax: { serverUrl: MCP_URL } } }, null, 2),
  },
  { key: "other", name: "Other" },
]

/* A tabbed "connect your assistant" panel: pick an assistant, get the
   command or config for it (with a copy button) and one line on where it
   goes. Always dark, like the site's terminal panels. */
export function McpConnect() {
  const t = useTranslations("home.askParallax.connect")
  const [active, setActive] = useState(CLIENTS[0].key)
  const client = CLIENTS.find((c) => c.key === active) ?? CLIENTS[0]

  return (
    <div className="on-dark-surface overflow-hidden rounded-xl border border-stroke bg-[#050506] text-white shadow-[0_24px_80px_-24px_rgb(0_0_0/0.7)]">
      <div className="border-b border-hairline px-4 pt-4 pb-3">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-white/70">{t("title")}</p>
        <div role="tablist" aria-label={t("title")} className="-mx-1 mt-3 flex flex-wrap gap-1">
          {CLIENTS.map((c) => (
            <button
              key={c.key}
              role="tab"
              type="button"
              aria-selected={c.key === active}
              aria-controls="mcp-connect-panel"
              onClick={() => setActive(c.key)}
              className={cn(
                "relative cursor-pointer rounded-full px-3 py-1.5 text-[13px] transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                c.key === active ? "text-black" : "text-white/65 hover:bg-white/10 hover:text-white"
              )}
            >
              {/* The active pill is one shared element that slides from tab
                  to tab (layoutId) instead of snapping */}
              {c.key === active && (
                <motion.span
                  layoutId="mcp-connect-pill"
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <span className="relative">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* The panel's content cross-fades between assistants, and its height
          follows so the box grows and shrinks smoothly */}
      <motion.div layout transition={{ type: "spring", stiffness: 400, damping: 40 }} className="overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={client.key}
        id="mcp-connect-panel"
        role="tabpanel"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
        className="space-y-4 p-5 sm:p-6"
      >
        <p className="text-[15px] leading-relaxed text-white/80">{t(`clients.${client.key}` as "clients.claude")}</p>
        {client.snippet && (
          <div className="overflow-hidden rounded-lg border border-hairline bg-white/[0.03]">
            {client.where && (
              <p className="border-b border-hairline px-4 py-2 font-mono text-[11px] text-white/50">{client.where}</p>
            )}
            <div className="flex items-start gap-2 py-3 pr-2 pl-4">
              <pre className="min-w-0 flex-1 overflow-x-auto font-mono text-[13px] leading-relaxed text-white/85">
                {!client.where && <span aria-hidden className="select-none text-brand">$ </span>}
                {client.snippet}
              </pre>
              <CopyButton value={client.snippet} label={t("copy")} copiedLabel={t("copied")} className="text-white/60 hover:bg-white/10 hover:text-white" />
            </div>
          </div>
        )}
        {!client.snippet && (
          <div className="flex items-center gap-2 rounded-lg border border-hairline bg-white/[0.03] py-2 pr-2 pl-4">
            <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-white/85">{MCP_URL}</code>
            <CopyButton value={MCP_URL} label={t("copy")} copiedLabel={t("copied")} className="text-white/60 hover:bg-white/10 hover:text-white" />
          </div>
        )}
      </motion.div>
      </AnimatePresence>
      </motion.div>
    </div>
  )
}
