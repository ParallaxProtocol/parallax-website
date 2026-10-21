/* The Parallax explorer's home page (explorer.parallaxprotocol.org), drawn as
   SVG after Blockscout's frontend, which it runs: its layout (the gas bar,
   the vertical navigation, the hero with search, the stats tiles beside the
   daily transactions chart, latest blocks and latest transactions), its
   sprite icons, radii (base 8px, md 12px) and tag colours, and its "github"
   identicons (react-identicons: an md5-seeded, mirrored 5×5 grid on white).
   The deployment's own theming (the mint links, the hero's gradient, the
   greys) is taken from a capture of the live site. One unit is one CSS
   pixel of a 1440×900 viewport. */

const SANS = "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"

const C = {
  bg: "#000000",
  panel: "#0c0c0c",
  divider: "rgb(255 255 255 / 8%)",
  border: "rgb(255 255 255 / 10%)",
  text: "#ffffff",
  secondary: "#adadb0",
  faint: "#616065",
  link: "#1ee592",
  heroText: "#e8fff3",
  placeholder: "#76849d",
  // Tag "orange" (badge.orange: orange.800 behind orange.100), and the
  // new-items notice (alert warning: orange.800 at 44%)
  tagBg: "#7b341e",
  tagFg: "#feebcb",
  notice: "rgb(123 52 30 / 44%)",
  noticeFg: "#efd1c6",
  good: "#2f9e6e",
}

// Blockscout's sprite icons (src/sprite/icons), as they are drawn
const ICON = {
  globe: {
    vb: 30,
    d: "M14.688 4.75c-5.482 0-9.938 4.456-9.938 9.938 0 5.481 4.456 9.937 9.938 9.937 5.481 0 9.937-4.456 9.937-9.938 0-5.481-4.456-9.937-9.938-9.937Zm3.499 5.781a14.655 14.655 0 0 0-1.813-3.855 8.151 8.151 0 0 1 5.359 3.855h-3.546Zm-7.219 0H7.644a8.16 8.16 0 0 1 5.094-3.787 14.079 14.079 0 0 0-1.77 3.787Zm5.39 0h-3.56a12.705 12.705 0 0 1 1.78-3.382 12.64 12.64 0 0 1 1.78 3.382ZM6.5 14.687c0-.831.131-1.65.369-2.406h3.692a14.62 14.62 0 0 0-.013 4.737l-3.695.027a7.864 7.864 0 0 1-.353-2.358Zm5.83 2.327c-.3-1.57-.3-3.176 0-4.733h4.496c.3 1.555.3 3.147.028 4.705l-4.524.028Zm6.295-.047a14.364 14.364 0 0 0-.029-4.686h3.91c.238.756.369 1.575.369 2.406 0 .783-.116 1.542-.313 2.252l-3.937.028Zm-2.246 5.73a14.004 14.004 0 0 0 1.843-3.98l3.596-.026a8.21 8.21 0 0 1-5.439 4.005Zm-1.802-.472a12.283 12.283 0 0 1-1.8-3.462l3.613-.026a12.946 12.946 0 0 1-1.813 3.488Zm-1.84.406a8.208 8.208 0 0 1-5.128-3.837l3.328-.027c.394 1.347 1 2.657 1.8 3.864Z",
  },
  tokens: {
    vb: 30,
    d: "M10.466 11.652c-1.382 0-2.697-.3-3.697-.848C5.63 10.182 5 9.3 5 8.326c0-.974.628-1.854 1.77-2.478C7.768 5.301 9.081 5 10.465 5c1.385 0 2.698.301 3.695.848 1.142.624 1.77 1.504 1.77 2.478 0 .974-.626 1.856-1.77 2.478-.997.547-2.31.848-3.695.848Zm0-5.171c-1.123 0-2.212.243-2.986.666-.635.345-1 .777-1 1.18 0 .4.365.83 1 1.178.774.424 1.863.666 2.986.666 1.123 0 2.213-.242 2.987-.666.635-.345.999-.777.999-1.179s-.364-.832-1-1.179c-.771-.423-1.862-.666-2.986-.666ZM22.131 14.976a.74.74 0 0 1-.484-1.3c.216-.187.473-.48.473-.82 0-.871-1.704-1.845-3.985-1.845-.967 0-1.907.177-2.647.5a.74.74 0 1 1-.592-1.357c.935-.408 2.056-.624 3.239-.624 1.384 0 2.697.3 3.696.848 1.142.624 1.77 1.504 1.77 2.478 0 .713-.341 1.382-.987 1.94a.74.74 0 0 1-.483.18Zm-11.665 6.056c-1.382 0-2.697-.302-3.697-.849C5.629 19.56 5 18.679 5 17.705V8.328a.74.74 0 0 1 1.48 0v9.377c0 .402.365.832 1 1.179.774.424 1.862.667 2.986.667a7.128 7.128 0 0 0 2.205-.333c.111-.037.218-.076.316-.115a.74.74 0 0 1 .556 1.372 5.529 5.529 0 0 1-.409.148 8.633 8.633 0 0 1-2.668.409ZM15.192 14.456a.74.74 0 0 1-.74-.74v-5.39a.74.74 0 0 1 1.48 0v5.39a.74.74 0 0 1-.74.74Zm-4.726 4.174c-1.382 0-2.697-.3-3.697-.848C5.629 17.159 5 16.28 5 15.305a.74.74 0 1 1 1.48 0c0 .87 1.705 1.845 3.986 1.845a7.134 7.134 0 0 0 2.205-.332c.159-.053.31-.11.449-.172a.74.74 0 1 1 .597 1.355 6.64 6.64 0 0 1-.581.223 8.624 8.624 0 0 1-2.67.407ZM10.466 16.231c-1.382 0-2.697-.301-3.697-.848C5.629 14.758 5 13.879 5 12.905a.74.74 0 1 1 1.48 0c0 .871 1.705 1.845 3.986 1.845.941 0 1.829-.161 2.567-.466a.74.74 0 1 1 .566 1.368c-.916.379-1.999.579-3.133.579Zm4.402-1.644a.74.74 0 0 1-.602-1.17.882.882 0 0 0 .186-.512.74.74 0 1 1 1.48 0c0 .482-.155.944-.46 1.373a.74.74 0 0 1-.604.31ZM10.466 13.83c-1.382 0-2.697-.3-3.697-.848C5.63 12.358 5 11.478 5 10.505a.74.74 0 1 1 1.48 0c0 .401.365.83 1 1.178.774.424 1.863.667 2.986.667 1.123 0 2.215-.243 2.987-.667.635-.345.999-.777.999-1.178a.74.74 0 1 1 1.48 0c0 .973-.627 1.853-1.769 2.477-.999.548-2.312.849-3.697.849Zm7.668 5.856c-1.52 0-2.96-.33-4.055-.93-1.236-.676-1.917-1.625-1.917-2.673s.681-1.997 1.917-2.674c1.096-.599 2.536-.929 4.055-.929 1.52 0 2.962.33 4.055.93 1.236.676 1.918 1.628 1.918 2.673 0 1.045-.681 1.996-1.918 2.674-1.095.599-2.535.929-4.055.929Zm0-5.725c-1.257 0-2.475.272-3.343.747-.73.4-1.148.9-1.148 1.375s.418.976 1.148 1.375c.868.473 2.085.747 3.343.747 1.26 0 2.476-.272 3.344-.747.73-.4 1.148-.9 1.148-1.375s-.42-.976-1.148-1.375c-.868-.475-2.085-.747-3.344-.747ZM18.134 25c-1.52 0-2.96-.33-4.055-.93-1.236-.675-1.917-1.625-1.917-2.673v-5.314a.74.74 0 0 1 1.481 0v5.314c0 .475.418.976 1.148 1.375.868.475 2.086.748 3.343.748 1.258 0 2.476-.273 3.344-.748.728-.398 1.148-.9 1.148-1.375v-5.314a.74.74 0 0 1 1.48 0v5.314c0 1.048-.68 1.998-1.917 2.674-1.095.6-2.535.93-4.055.93ZM18.134 22.343c-1.52 0-2.96-.33-4.055-.93-1.236-.676-1.917-1.626-1.917-2.673a.74.74 0 1 1 1.481 0c0 .474.418.976 1.148 1.374.868.476 2.086.748 3.343.748 1.258 0 2.476-.272 3.344-.748.728-.398 1.148-.9 1.148-1.374a.74.74 0 1 1 1.48 0c0 1.047-.68 1.997-1.917 2.674-1.095.599-2.535.929-4.055.929Zm4.726-6.673a.74.74 0 0 1-.74-.741v-2.073a.74.74 0 1 1 1.48 0v2.073a.74.74 0 0 1-.74.74Z",
  },
  stats: {
    vb: 30,
    d: "M11.615 5.192c0-.934.758-1.692 1.693-1.692h2.538c.935 0 1.692.758 1.692 1.692v18.616c0 .934-.757 1.692-1.692 1.692h-2.538a1.692 1.692 0 0 1-1.693-1.692V5.192Zm4.231.339a.339.339 0 0 0-.338-.339h-1.862a.339.339 0 0 0-.338.339v17.938c0 .187.151.339.338.339h1.862a.339.339 0 0 0 .338-.339V5.531ZM4 19.577c0-.935.758-1.692 1.692-1.692h2.539c.934 0 1.692.757 1.692 1.692v4.23c0 .935-.758 1.693-1.692 1.693H5.692A1.692 1.692 0 0 1 4 23.808v-4.231Zm4.23.338a.339.339 0 0 0-.338-.338H6.031a.339.339 0 0 0-.339.338v3.554a.34.34 0 0 0 .339.339h1.861a.338.338 0 0 0 .339-.339v-3.554Zm12.693-9.646c-.934 0-1.692.758-1.692 1.693v11.846c0 .934.757 1.692 1.692 1.692h2.539c.934 0 1.692-.758 1.692-1.692V11.962c0-.935-.758-1.693-1.692-1.693h-2.539Zm2.2 1.693c.187 0 .339.151.339.338v11.17a.338.338 0 0 1-.339.338h-1.861a.338.338 0 0 1-.339-.339V12.3c0-.187.152-.338.339-.338h1.861Z",
  },
  api: {
    vb: 30,
    d: "M23 4.3H7A2.7 2.7 0 0 0 4.3 7v16A2.7 2.7 0 0 0 7 25.7h16a2.7 2.7 0 0 0 2.7-2.7V7A2.7 2.7 0 0 0 23 4.3ZM7 3a4 4 0 0 0-4 4v16a4 4 0 0 0 4 4h16a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4H7ZM14.911 11a1 1 0 0 0-1 1v7.111a1 1 0 1 0 2 0v-1.667h1.667a2.778 2.778 0 0 0 2.777-2.777v-.89A2.778 2.778 0 0 0 17.578 11H14.91Zm2.667 4.444H15.91V13h1.667a.777.777 0 0 1 .777.778v.889a.777.777 0 0 1-.777.777Zm-10.778 1v-2.222a3.222 3.222 0 0 1 6.444 0v4.889a1 1 0 1 1-2 0v-1.667H8.8v1.667a1 1 0 1 1-2 0v-2.667Zm2-1h2.444v-1.222a1.222 1.222 0 1 0-2.444 0v1.222ZM22.022 11a1 1 0 0 1 1 1v7.111a1 1 0 1 1-2 0V12a1 1 0 0 1 1-1Z",
  },
  block: {
    vb: 20,
    d: "M9.83 0 1 5.03v10.267l6.825 3.976-.034-1.67-5.421-3.175V6.8l6.757 3.818V19.6l.713.4.736-.401v-8.98L17.323 6.8v7.628l-5.388 3.108v1.67l6.858-3.834V5.029L9.829 0Zm0 9.415L3.238 5.531l6.59-3.877 6.75 3.877-6.75 3.884Zm-5.082 3.767 1.32-.752-.112-.196-1.32.752.112.196ZM7.06 11.86l1.32-.752-.113-.196-1.32.752.113.196Zm2.868-3.527V6.821h-.226v1.512h.226Zm0-2.636v-1.52h-.226v1.52h.226Zm0-2.534v-1.52h-.226v1.52h.226Zm2.854 8.51-1.31-.76-.114.195 1.311.76.114-.196Zm2.287 1.322-1.32-.76-.113.195 1.32.76.113-.195Zm-12.654 1.52 1.311-.751-.112-.196-1.311.751.112.196Zm14.979-.198-1.311-.76-.114.195 1.311.76.114-.195Z",
  },
  clock: {
    vb: 20,
    d: "M10 .3C4.643.3.3 4.643.3 10c0 5.357 4.343 9.7 9.7 9.7 5.357 0 9.7-4.343 9.7-9.7 0-5.357-4.343-9.7-9.7-9.7ZM2.2 10a7.8 7.8 0 1 1 15.6 0 7.8 7.8 0 0 1-15.6 0ZM10 4.05a.95.95 0 0 0-.95.95v5c0 .525.425.95.95.95h5a.95.95 0 1 0 0-1.9h-3.75a.3.3 0 0 1-.3-.3V5a.95.95 0 0 0-.95-.95Z",
  },
  transactions: {
    vb: 20,
    d: "M17.77 7.794H.987a.97.97 0 0 1-.549-.17 1.009 1.009 0 0 1-.364-.453 1.041 1.041 0 0 1 .218-1.106l3.722-3.827a.97.97 0 0 1 1.333.06 1.033 1.033 0 0 1 .058 1.37L3.371 5.764H17.77c.262 0 .513.107.698.297a1.031 1.031 0 0 1 0 1.435.973.973 0 0 1-.698.297ZM2.23 12.066h16.783c.195 0 .386.059.549.17.162.11.289.269.364.454a1.042 1.042 0 0 1-.218 1.106l-3.737 3.842-.006.007a.99.99 0 0 1-.711.354.963.963 0 0 1-.736-.296 1.017 1.017 0 0 1-.289-.757 1.04 1.04 0 0 1 .345-.731l.007-.007 2.047-2.112H2.23a.973.973 0 0 1-.698-.298 1.03 1.03 0 0 1-.29-.717c0-.27.105-.527.29-.718a.974.974 0 0 1 .698-.297Z",
  },
  wallet: {
    vb: 20,
    d: "M17.139 20H4.83a3.847 3.847 0 0 1-3.846-3.845V5.39a.769.769 0 0 1 .77-.769h15.384a3.847 3.847 0 0 1 3.846 3.845v7.69A3.844 3.844 0 0 1 17.139 20ZM2.524 6.16v9.996a2.307 2.307 0 0 0 2.307 2.307H17.14a2.308 2.308 0 0 0 2.308-2.307v-7.69A2.306 2.306 0 0 0 17.14 6.16H2.524ZM18.677 6.159a.77.77 0 0 1-.769-.77V3.276a1.79 1.79 0 0 0-.6-1.438 1.493 1.493 0 0 0-1.284-.246l-12.9 2.93a.77.77 0 0 0-.6.769.769.769 0 0 1-1.539 0A2.306 2.306 0 0 1 2.778 3.02L15.685.091a3 3 0 0 1 2.585.546 3.338 3.338 0 0 1 1.177 2.638V5.39a.77.77 0 0 1-.77.769Zm1.539 9.227H14.83a3.077 3.077 0 0 1-2.175-5.25 3.074 3.074 0 0 1 2.175-.902h5.385a.77.77 0 0 1 .769.77v4.613a.77.77 0 0 1-.77.769Zm-5.385-4.614a1.539 1.539 0 1 0 0 3.076h4.616v-3.076H14.83Z",
  },
  gas: {
    vb: 20,
    d: "M12 17h1v2H0v-2h1V2a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v8h2a2 2 0 0 1 2 2v4a1 1 0 0 0 2 0V9h-2a1 1 0 0 1-1-1V4.414l-1.657-1.657 1.414-1.414 4.95 4.95A.996.996 0 0 1 20 7v9a3 3 0 0 1-6 0v-4h-2v5Zm-9 0h7v-6H3v6ZM3 3v6h7V3H3Z",
  },
  search: {
    vb: 20,
    d: "m14.048 13.074 2.464 2.463a.69.69 0 1 1-.975.975l-2.463-2.464A6.205 6.205 0 0 1 3 9.202 6.205 6.205 0 0 1 9.203 3a6.205 6.205 0 0 1 4.845 10.074Zm-1.382-.512a4.823 4.823 0 0 0-3.463-8.184 4.822 4.822 0 0 0-4.825 4.825 4.823 4.823 0 0 0 8.184 3.463l.104-.104Z",
  },
  copy: {
    vb: 20,
    d: "M8.597 3H1.228C.55 3 0 3.57 0 4.273v8.909h1.228v-8.91h7.369V3Zm1.842 2.545H3.684c-.678 0-1.228.57-1.228 1.273v8.91c0 .702.55 1.272 1.228 1.272h6.755c.678 0 1.228-.57 1.228-1.273V6.818c0-.703-.55-1.273-1.228-1.273Zm0 10.182H3.684V6.818h6.755v8.91Z",
  },
  info: {
    vb: 20,
    d: "M13.034 3H6.965C4.587 3 3 4.703 3 7.141v5.718C3 15.299 4.583 17 6.965 17h6.068C15.416 17 17 15.3 17 12.859V7.14C17 4.701 15.416 3 13.034 3ZM6.965 4.05h6.069c1.785 0 2.916 1.214 2.916 3.091v5.718c0 1.877-1.13 3.091-2.917 3.091H6.966c-1.786 0-2.916-1.214-2.916-3.091V7.14c0-1.874 1.134-3.091 2.915-3.091ZM10 6.818a.525.525 0 0 1 .072 1.045l-.079.005a.525.525 0 0 1-.07-1.045L10 6.818Zm-.007 2.221c.266 0 .486.198.52.454l.005.071v3.093a.525.525 0 0 1-1.045.072l-.005-.072V9.564c0-.29.235-.525.525-.525Z",
  },
  gear: {
    vb: 18,
    d: "M8.039 17.16h2.432a.608.608 0 0 0 .584-.608v-.827a.84.84 0 0 1 1.429-.608l.608.608a.608.608 0 0 0 .864 0l1.72-1.72a.61.61 0 0 0 0-.864l-.608-.608a.84.84 0 0 1 .608-1.43h.876a.608.608 0 0 0 .608-.607V8.063a.608.608 0 0 0-.608-.608h-.857a.84.84 0 0 1-.608-1.429l.608-.608a.607.607 0 0 0 0-.863l-1.721-1.721a.609.609 0 0 0-.864 0l-.608.608a.84.84 0 0 1-1.429-.608v-.876a.608.608 0 0 0-.608-.608H8.033a.608.608 0 0 0-.608.608v.845a.84.84 0 0 1-1.43.608l-.607-.608a.608.608 0 0 0-.864 0L2.834 4.53a.608.608 0 0 0 0 .864l.608.608a.84.84 0 0 1-.608 1.429h-.876a.608.608 0 0 0-.608.608v2.438a.608.608 0 0 0 .608.608h.845a.839.839 0 0 1 .608 1.43l-.608.607a.609.609 0 0 0 0 .864l1.727 1.69a.608.608 0 0 0 .864 0l.608-.608a.84.84 0 0 1 1.429.608v.876a.608.608 0 0 0 .608.608Zm1.824-1.216H8.647v-.268a2.049 2.049 0 0 0-3.503-1.447l-.188.189-.863-.864.188-.188a2.05 2.05 0 0 0-1.447-3.503h-.268V8.647h.268A2.05 2.05 0 0 0 4.28 5.144l-.188-.188.863-.864.188.189a2.05 2.05 0 0 0 3.503-1.447v-.268h1.216v.268a2.05 2.05 0 0 0 3.503 1.447l.188-.189.864.864-.189.188a2.05 2.05 0 0 0 1.447 3.503h.268v1.216h-.268a2.05 2.05 0 0 0-1.447 3.503l.189.188-.864.864-.188-.189a2.05 2.05 0 0 0-3.503 1.447v.268Zm-2.297-4.161a3.04 3.04 0 1 0 3.378-5.056 3.04 3.04 0 0 0-3.378 5.056Zm.676-4.045a1.824 1.824 0 1 1 2.027 3.034 1.824 1.824 0 0 1-2.027-3.034Z",
  },
  east: {
    vb: 24,
    d: "M13.758 11c.89 0 1.337-1.077.707-1.707l-2.95-2.95a1 1 0 1 1 1.414-1.414l6.364 6.364a1 1 0 0 1 0 1.414l-6.364 6.364a1 1 0 1 1-1.414-1.414l2.95-2.95c.63-.63.184-1.707-.707-1.707H5a1 1 0 1 1 0-2h8.758Z",
  },
} as const

type IconName = keyof typeof ICON | "other"

/* A sprite icon in a size×size box at (x, y), filled with color. */
function Icon({ name, x, y, size, color = C.text, rotate }: { name: IconName; x: number; y: number; size: number; color?: string; rotate?: number }) {
  if (name === "other") {
    // navigation/other: a gear drawn in strokes
    return (
      <g transform={`translate(${x} ${y}) scale(${size / 30})`} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="m23.528 10.345-.622-1.08a1.913 1.913 0 0 0-2.609-.704 1.904 1.904 0 0 1-2.609-.678 1.83 1.83 0 0 1-.256-.915A1.914 1.914 0 0 0 15.519 5h-1.254a1.904 1.904 0 0 0-1.904 1.913 1.913 1.913 0 0 1-1.913 1.886 1.83 1.83 0 0 1-.915-.257 1.913 1.913 0 0 0-2.609.705l-.668 1.098a1.913 1.913 0 0 0 .695 2.61 1.913 1.913 0 0 1 0 3.313 1.904 1.904 0 0 0-.695 2.6l.631 1.088a1.913 1.913 0 0 0 2.61.742 1.895 1.895 0 0 1 2.599.696c.164.277.252.593.256.915 0 1.056.856 1.913 1.913 1.913h1.254a1.913 1.913 0 0 0 1.913-1.904 1.904 1.904 0 0 1 1.913-1.913c.322.009.636.097.915.256a1.913 1.913 0 0 0 2.61-.695l.658-1.099a1.904 1.904 0 0 0-.696-2.608 1.904 1.904 0 0 1-.695-2.61c.166-.289.406-.529.695-.695a1.913 1.913 0 0 0 .696-2.6v-.008Z" />
        <circle cx={14.896} cy={14.611} r={2.636} />
      </g>
    )
  }
  const i = ICON[name]
  const c = size / 2
  return (
    <g transform={`translate(${x} ${y})${rotate ? ` rotate(${rotate} ${c} ${c})` : ""} scale(${size / i.vb})`} fill={color} fillRule="evenodd">
      <path d={i.d} />
    </g>
  )
}

/* The "github" identicon: md5(address) gives the colour (its first six hex
   digits) and a mirrored 5×5 grid of cells, on white, in a circle. Worked
   out for each address below as react-identicons 1.2.5 does. */
const IDENT: Record<string, { color: string; cells: [number, number][] }> = {
  "0x03…C97c": { color: "#4ff029", cells: [[0, 1], [0, 2], [1, 0], [1, 1], [1, 3], [2, 0], [2, 3], [3, 0], [3, 1], [3, 3], [4, 1], [4, 2]] },
  "0xf8…31Cc": { color: "#40dacc", cells: [[0, 2], [0, 3], [0, 4], [1, 0], [1, 1], [1, 3], [1, 4], [2, 0], [2, 2], [2, 4], [3, 0], [3, 1], [3, 3], [3, 4], [4, 2], [4, 3], [4, 4]] },
  "0x18…E67f": { color: "#f255cc", cells: [[0, 0], [0, 4], [1, 0], [1, 1], [2, 0], [2, 1], [2, 2], [2, 3], [3, 0], [3, 1], [4, 0], [4, 4]] },
  "0x54…d2A8": { color: "#4a3bfc", cells: [[0, 1], [0, 3], [0, 4], [1, 0], [1, 4], [2, 0], [2, 2], [2, 3], [3, 0], [3, 4], [4, 1], [4, 3], [4, 4]] },
  "0x88…ec74": { color: "#ae1cbe", cells: [[0, 0], [0, 1], [0, 3], [0, 4], [1, 0], [1, 2], [2, 2], [2, 3], [3, 0], [3, 2], [4, 0], [4, 1], [4, 3], [4, 4]] },
  "0x29…d8B5": { color: "#dd108b", cells: [[0, 0], [0, 1], [0, 4], [1, 0], [1, 2], [2, 1], [2, 3], [3, 0], [3, 2], [4, 0], [4, 1], [4, 4]] },
}

function Identicon({ id, address, cx, cy, size = 20 }: { id: string; address: string; cx: number; cy: number; size?: number }) {
  const ident = IDENT[address]
  const cell = size / 5
  const x0 = cx - size / 2
  const y0 = cy - size / 2
  return (
    <g>
      <clipPath id={id}>
        <circle cx={cx} cy={cy} r={size / 2} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x={x0} y={y0} width={size} height={size} fill="#ffffff" />
        {ident.cells.map(([i, j]) => (
          <rect key={`${i}-${j}`} x={x0 + i * cell} y={y0 + j * cell} width={cell + 0.05} height={cell + 0.05} fill={ident.color} />
        ))}
      </g>
    </g>
  )
}

// The Parallax mark, in its own green to blue (the deployment's logo)
const LOGO =
  "m 171.48919,103.57486 -0.0214,30.61331 108.49225,-62.638032 0.007,-0.004 0.007,0.01164 52.90338,30.543593 -26.45177,15.27194 -26.46448,15.27987 1.8e-4,-7e-4 -108.53587,62.66321 -0.0213,30.51422 0.0429,0.0247 211.66649,-122.2057 -105.70521,-61.127344 z m 26.39475,137.56774 79.35321,45.88867 105.91862,-61.05365 0.0215,-30.71125 -110.18258,63.61394 -0.003,-0.005 -26.45194,-15.27225 26.45847,-15.27581 110.20048,-63.62427 0.0213,-30.56377 z"

const NAV: { icon: IconName; label: string; y: number; group: boolean }[] = [
  { icon: "globe", label: "Blockchain", y: 171, group: true },
  { icon: "tokens", label: "Tokens", y: 224, group: true },
  { icon: "stats", label: "Charts & stats", y: 276, group: true },
  { icon: "api", label: "API", y: 328, group: false },
  { icon: "other", label: "Other", y: 380, group: true },
]

// The main column, right of the 228px navigation
const MX = 277
const MR = 1392

/* A stats tile (HomeStatsWidget): its icon, a small label over the value. */
function StatTile({ x, y, w, icon, label, value, info }: { x: number; y: number; w: number; icon: IconName; label: string; value: string; info?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={62} rx={8} fill={C.panel} />
      <Icon name={icon} x={x + 19} y={y + 19} size={24} />
      <text x={x + 60} y={y + 26} fontSize={12} fill={C.secondary}>
        {label}
      </text>
      <text x={x + 60} y={y + 47} fontSize={18} fontWeight={500}>
        {value}
      </text>
      {info && <Icon name="info" x={x + w - 31} y={y + 21} size={20} color={C.faint} />}
    </g>
  )
}

// Daily transactions over the chart's span, in its own coordinates
const DAILY: [number, number][] = [
  [855, 367], [872, 372], [890, 371], [909, 362], [925, 380], [943, 383], [965, 380], [979, 355], [997, 374], [1015, 376], [1037, 381], [1058, 397], [1076, 405], [1094, 403], [1107, 416], [1127, 412], [1145, 397], [1163, 400], [1181, 409], [1201, 410], [1220, 400], [1235, 396], [1253, 348], [1267, 344], [1289, 346], [1303, 380], [1325, 381], [1343, 381], [1359, 399], [1376, 358],
]

/* The points as a smooth curve: Catmull-Rom, as a chart's monotone line reads. */
function smooth(pts: [number, number][]) {
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const [x1, y1] = pts[i]
    const [x2, y2] = pts[i + 1]
    const p3 = pts[i + 2] ?? pts[i + 1]
    const c1x = x1 + (x2 - p0[0]) / 6
    const c1y = y1 + (y2 - p0[1]) / 6
    const c2x = x2 - (p3[0] - x1) / 6
    const c2y = y2 - (p3[1] - y1) / 6
    d += `C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${x2} ${y2}`
  }
  return d
}

const BLOCKS = [
  { n: "60395", ago: "14m ago", txn: "1", reward: "50.00042" },
  { n: "60394", ago: "22m ago", txn: "6", reward: "50.00015246" },
  { n: "60393", ago: "28m ago", txn: "0", reward: "50" },
]

// Each row's copy buttons sit where its hash and addresses end, as they did
// in the capture: [after the hash, after from, after to] (centres)
const TXS: { hash: string; ago: string; from: string; to: string; value: string; fee: string; at: [number, number, number] }[] = [
  { hash: "0x87f0…3f83", ago: "14m ago", from: "0x03…C97c", to: "0xf8…31Cc", value: "4.94958", fee: "0.00042", at: [794, 1040, 1035] },
  { hash: "0x0f0b…999b", ago: "22m ago", from: "0x18…E67f", to: "0x54…d2A8", value: "13.22947", fee: "0.00003", at: [798, 1033, 1042] },
  { hash: "0x359c…59ce", ago: "22m ago", from: "0x88…ec74", to: "0x54…d2A8", value: "33.95817", fee: "0.00003", at: [799, 1037, 1042] },
  { hash: "0x7d12…0f8e", ago: "22m ago", from: "0x29…d8B5", to: "0x54…d2A8", value: "18.50547", fee: "0.00003", at: [793, 1042, 1042] },
]

export function ExplorerArt({ alt }: { alt: string }) {
  const line = smooth(DAILY)
  return (
    <svg viewBox="0 0 1440 900" role="img" aria-label={alt} className="block h-auto w-full select-none" fontFamily={SANS} fontSize={14} fill={C.text}>
      <defs>
        <linearGradient id="ex-logo" x1="224.358" y1="73.057" x2="330.266" y2="256.495" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#00ff80" />
          <stop offset="1" stopColor="#0080ff" />
        </linearGradient>
        {/* The hero's gradient: mint from its top left, blue into its bottom right, black between */}
        <radialGradient id="ex-hero-green" gradientUnits="userSpaceOnUse" cx={MX} cy={60} r={420} gradientTransform={`translate(${MX} 60) scale(1 0.55) translate(${-MX} -60)`}>
          <stop offset="0" stopColor="#00ff80" stopOpacity={0.24} />
          <stop offset="0.5" stopColor="#00ff80" stopOpacity={0.07} />
          <stop offset="1" stopColor="#00ff80" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="ex-hero-blue" gradientUnits="userSpaceOnUse" cx={MR} cy={213} r={560} gradientTransform={`translate(${MR} 213) scale(1 0.5) translate(${-MR} -213)`}>
          <stop offset="0" stopColor="#0080ff" stopOpacity={0.24} />
          <stop offset="0.5" stopColor="#0080ff" stopOpacity={0.07} />
          <stop offset="1" stopColor="#0080ff" stopOpacity={0} />
        </radialGradient>
        <clipPath id="ex-hero-clip">
          <rect x={MX} y={60} width={MR - MX} height={153} rx={12} />
        </clipPath>
        <linearGradient id="ex-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.link} stopOpacity={0.32} />
          <stop offset="1" stopColor={C.link} stopOpacity={0} />
        </linearGradient>
        <clipPath id="ex-page">
          <rect width={1440} height={900} />
        </clipPath>
      </defs>

      <g clipPath="url(#ex-page)">
        <rect width={1440} height={900} fill={C.bg} />

        {/* Top bar: the gas price, and the settings */}
        <rect width={1440} height={36} fill={C.panel} />
        <text x={24} y={22} fontSize={12} fill={C.secondary}>
          Gas
          <tspan dx={4} fill={C.link}>
            1.5 Gwei
          </tspan>
        </text>
        <Icon name="gear" x={1396} y={9} size={19} color={C.link} />

        {/* Navigation, vertical */}
        <line x1={228.5} y1={36} x2={228.5} y2={900} stroke={C.divider} />
        <g transform="translate(35 92) scale(0.0869)">
          <path transform="translate(-145.01123,-32.460674)" fill="url(#ex-logo)" d={LOGO} />
        </g>
        <text x={66} y={113} fontSize={24} fontWeight={600} letterSpacing="-0.01em">
          Parallax
        </text>
        {NAV.map((n) => (
          <g key={n.label}>
            <Icon name={n.icon} x={32} y={n.y - 15} size={30} />
            <text x={74} y={n.y + 5}>
              {n.label}
            </text>
            {n.group && (
              <path d={`M182 ${n.y - 5}l5 5-5 5`} fill="none" stroke={C.text} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            )}
          </g>
        ))}

        {/* Hero: the explorer's name over the search */}
        <g clipPath="url(#ex-hero-clip)">
          <rect x={MX} y={60} width={MR - MX} height={153} fill="#000" />
          <rect x={MX} y={60} width={MR - MX} height={153} fill="url(#ex-hero-green)" />
          <rect x={MX} y={60} width={MR - MX} height={153} fill="url(#ex-hero-blue)" />
        </g>
        <rect x={MX + 0.5} y={60.5} width={MR - MX - 1} height={152} rx={11.5} fill="none" stroke="#1e2b32" />
        <text x={311} y={122} fontSize={30} fontWeight={700} fill={C.heroText}>
          Parallax explorer
        </text>
        <rect x={311} y={142} width={1048} height={40} rx={8} fill="#000" />
        <Icon name="search" x={318} y={152} size={20} color={C.placeholder} />
        <text x={346} y={166.5} fill={C.placeholder}>
          Search by address / txn hash / block / token/...
        </text>
        <rect x={1331.5} y={151.5} width={19} height={19} rx={4} fill="none" stroke="rgb(255 255 255 / 30%)" />
        <text x={1341} y={166} textAnchor="middle" fontSize={12} fill={C.secondary}>
          /
        </text>

        {/* Stats tiles */}
        <StatTile x={MX} y={227} w={272} icon="block" label="Total blocks" value="60,383" />
        <StatTile x={558} y={227} w={272} icon="clock" label="Average block time" value="582.0s" />
        <StatTile x={MX} y={299} w={272} icon="transactions" label="Total txns" value="146,462" />
        <StatTile x={558} y={299} w={272} icon="wallet" label="Total addresses" value="3,930" />
        <StatTile x={MX} y={371} w={553} icon="gas" label="Gas tracker" value="1.5 Gwei" info />

        {/* Chain indicators: daily transactions */}
        <rect x={839} y={227} width={MR - 839} height={206} rx={8} fill={C.panel} />
        <text x={855} y={256} fontSize={16} fontWeight={500}>
          Daily transactions
        </text>
        <Icon name="info" x={994} y={240} size={20} color={C.faint} />
        <text x={855} y={295} fontSize={30} fontWeight={600}>
          369
        </text>
        <path d={`${line}L1376 420L855 420Z`} fill="url(#ex-area)" />
        <path d={line} fill="none" stroke={C.link} strokeWidth={2} strokeLinejoin="round" />

        {/* Latest blocks */}
        <text x={MX} y={484} fontSize={20} fontWeight={500}>
          Latest blocks
        </text>
        <text x={MX} y={513}>
          Network utilization:
          <tspan dx={4} fontWeight={700} fill={C.good}>
            0.01%
          </tspan>
        </text>
        {BLOCKS.map((b, i) => {
          const y = 533 + i * 146
          return (
            <g key={b.n}>
              <rect x={MX + 0.5} y={y + 0.5} width={279} height={135} rx={12} fill="none" stroke={C.border} />
              <Icon name="block" x={290} y={y + 13} size={20} />
              <text x={318} y={y + 29} fontSize={16} fontWeight={500} fill={C.link}>
                {b.n}
              </text>
              <text x={544} y={y + 29} textAnchor="end" fill={C.secondary}>
                {b.ago}
              </text>
              <text x={290} y={y + 63}>
                Txn
              </text>
              <text x={346} y={y + 63} fill={C.secondary}>
                {b.txn}
              </text>
              <text x={290} y={y + 91}>
                Reward
              </text>
              <text x={346} y={y + 91} fill={C.secondary}>
                {b.reward} LAX
              </text>
              <text x={290} y={y + 119}>
                Miner
              </text>
              <text x={346} y={y + 119} fill={C.link}>
                0x6C…6B08
              </text>
            </g>
          )
        })}

        {/* Latest transactions */}
        <text x={605} y={484} fontSize={20} fontWeight={500}>
          Latest transactions
        </text>
        <path d={`M${605 + 8} 503h${MR - 605 - 16}a8 8 0 0 1 8 8v23H605v-23a8 8 0 0 1 8-8z`} fill={C.notice} />
        <text x={621} y={523} fill={C.noticeFg}>
          scanning new transactions...
        </text>
        {TXS.map((t, i) => {
          const y = 534 + i * 90
          return (
            <g key={t.hash}>
              <line x1={605} y1={y + 90.5} x2={MR} y2={y + 90.5} stroke={C.divider} />
              {/* The row's more-info button */}
              <Icon name="info" x={623} y={y + 21} size={20} color={C.faint} />
              {/* TxType: Coin transfer, an orange tag */}
              <rect x={657} y={y + 19} width={94} height={24} rx={4} fill={C.tagBg} />
              <text x={662} y={y + 36} fontWeight={500} fill={C.tagFg}>
                Coin transfer
              </text>
              <Icon name="transactions" x={656} y={y + 51} size={20} />
              <text x={685} y={y + 66} fontWeight={700} fill={C.link}>
                {t.hash}
              </text>
              <Icon name="copy" x={t.at[0] - 9} y={y + 52} size={18} color={C.secondary} />
              <text x={t.at[0] + 22} y={y + 66} fill={C.secondary}>
                {t.ago}
              </text>
              {/* From, and under it to, the arrow turned down between them */}
              <Icon name="east" x={894} y={y + 16} size={20} color={C.secondary} rotate={90} />
              <Identicon id={`ex-id-${i}-f`} address={t.from} cx={932} cy={y + 26} />
              <text x={950} y={y + 31} fill={C.link}>
                {t.from}
              </text>
              <Icon name="copy" x={t.at[1] - 9} y={y + 17} size={18} color={C.secondary} />
              <Identicon id={`ex-id-${i}-t`} address={t.to} cx={932} cy={y + 58} />
              <text x={950} y={y + 63} fill={C.link}>
                {t.to}
              </text>
              <Icon name="copy" x={t.at[2] - 9} y={y + 49} size={18} color={C.secondary} />
              <text x={1206} y={y + 31}>
                Value
                <tspan dx={4} fill={C.secondary}>
                  {t.value} LAX
                </tspan>
              </text>
              <text x={1206} y={y + 63}>
                Fee
                <tspan dx={4} fill={C.secondary}>
                  {t.fee} LAX
                </tspan>
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}
