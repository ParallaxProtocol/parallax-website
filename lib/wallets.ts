// Wallets that work with Parallax through its Ethereum-compatible RPC, as
// listed on /wallets. The homepage's mobile band shows those with a phone
// app (every one but those marked mobile: false).
export type Wallet = {
  name: string
  image: string
  url: string
  recommended?: boolean
  mobile?: boolean
}

export const wallets: Wallet[] = [
  {
    name: "MetaMask",
    image: "/wallets/metamask.png",
    url: "https://metamask.io",
    recommended: true,
  },
  {
    name: "Coinbase Wallet",
    image: "/wallets/base.png",
    url: "https://wallet.coinbase.com",
    recommended: true,
  },
  {
    name: "Trust Wallet",
    image: "/wallets/trust.png",
    url: "https://trustwallet.com",
    recommended: true,
  },
  {
    name: "Rabby Wallet",
    image: "/wallets/rabby.png",
    url: "https://rabby.io",
  },
  {
    name: "Atomic Wallet",
    image: "/wallets/atomic.png",
    url: "https://atomicwallet.io",
  },
  {
    name: "CTRL Wallet",
    image: "/wallets/ctrl.png",
    url: "https://ctrl.xyz",
  },
  {
    name: "Brave Wallet",
    image: "/wallets/brave.png",
    url: "https://brave.com/wallet",
  },
  {
    name: "Phantom",
    image: "/wallets/phantom.png",
    url: "https://phantom.com",
  },
  {
    name: "Rainbow",
    image: "/wallets/rainbow.png",
    url: "https://rainbow.me",
  },
  {
    name: "Zerion",
    image: "/wallets/zerion.png",
    url: "https://zerion.io",
  },
  {
    name: "Frame",
    image: "/wallets/frame.png",
    url: "https://frame.sh",
    mobile: false,
  },
]
