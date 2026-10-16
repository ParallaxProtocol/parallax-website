/* Server component on purpose: the entrance runs as a CSS animation (see
   "Entrance animations" in globals.css) so the SSR HTML paints without
   waiting for hydration. The bottom padding spaces loose content off the
   footer; a page that ends in a full-bleed Section already carries its own
   padding, so it drops the extra band and runs straight into the footer. */
export default function MainMotion({ children }: { children: React.ReactNode }) {
  return <div className="enter-fade-up pb-24 has-[>[data-band]:last-child]:pb-0">{children}</div>
}
