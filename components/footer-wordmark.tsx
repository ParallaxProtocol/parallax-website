import { DepthWordmark } from "./depth-wordmark"

/* The footer's sign-off: the depth wordmark cropped by the page floor. The
   svg runs a little wider than the footer's content column and lets strokes
   spill past its edges, so the word bleeds out rather than stopping at the
   column. Decorative. */
export function FooterWordmark() {
  return (
    <div className="mx-auto mt-16 max-w-[90rem] px-5 md:px-10">
      <DepthWordmark
        variant="footer"
        area="footer"
        className="-mx-3 w-[calc(100%+1.5rem)] max-w-none md:-mx-6 md:w-[calc(100%+3rem)]"
      />
    </div>
  )
}
