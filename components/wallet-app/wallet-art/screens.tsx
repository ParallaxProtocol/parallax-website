import {
  ActivityPanel,
  AssistantPanel,
  Avatar,
  Badge,
  C,
  Divider,
  Figure,
  GlowCard,
  GroupedAddress,
  Icon,
  MID,
  MONO,
  OverviewPage,
  Panel,
  PR,
  PrimaryButton,
  Property,
  PX,
  SecondaryButton,
  Sparkles,
  W,
  WalletWindow,
  type Account,
} from "./kit"

/* Parallax Wallet's screens, each as the app lays it out (see kit.tsx).
   Each takes a distinct id prefix, as an inline SVG's ids are the page's. */

type ArtProps = { alt: string; className?: string }

export function OverviewArt(props: ArtProps) {
  return <WalletWindow {...props} uid="ov" nav="overview" title="Overview" page={<OverviewPage uid="ov-p" />} barSub="Block 60,045 · 9 peers · Up 2m" />
}

/* Steps (pages/Wallet/flow.tsx): the flow's progress in the toolbar, a glass
   pill of marks: Details done, Review at hand and named, Sent to come. */
function Steps() {
  const cy = 80
  return (
    <g>
      <rect x={1018.5} y={62.5} width={171} height={35} rx={17.5} fill={C.glass} stroke={C.glassEdge} />
      <circle cx={1037} cy={cy} r={9} fill={C.brandMark} />
      <Icon name="check" cx={1037} cy={cy} size={11} color={C.brandForeground} strokeWidth={3} />
      <line x1={1050} y1={cy} x2={1062} y2={cy} stroke={C.brandMark} />
      <circle cx={1075} cy={cy} r={8} fill="none" stroke={C.brandMark} strokeWidth={2} />
      <circle cx={1075} cy={cy} r={3} fill={C.brandMark} />
      <text x={1092} y={cy + 4.5} fontWeight={500}>
        Review
      </text>
      <line x1={1146} y1={cy} x2={1158} y2={cy} stroke={C.borderStrong} />
      <circle cx={1171} cy={cy} r={8.5} fill="none" stroke={C.borderStrong} />
    </g>
  )
}

/* Send's Review step (pages/Wallet/Send.tsx Review): what leaves the
   account, large, where it goes, then from, fee and total, and the buttons.
   `ledger`, it signs on a Ledger, waiting on the device. */
function SendReviewPage({ uid, from, fee, gas, total, ledger }: { uid: string; from: Account; fee: string; gas: string; total: string; ledger?: boolean }) {
  // The card's foot: the Ledger's row under a hairline, when it waits on one
  const cardH = ledger ? 340 : 264
  const rowsY = 128 + cardH + 20
  const prop = (i: number) => rowsY + 25 + i * 48
  const buttonsY = rowsY + 146 + 20
  return (
    <g>
      <GlowCard uid={uid} y={128} h={cardH} />
      <text x={MID} y={172} textAnchor="middle" fontSize={12} fontWeight={500} fill={C.muted}>
        Review and sign
      </text>
      <Figure uid={uid} x={MID} y={232} size={60} unitSize={30} value="100" anchor="middle" box={[680, 182, 790, 236]} />
      <Icon name="arrowDown" cx={736} cy={268} size={14} color={C.muted} />
      <text x={750} y={272} fontSize={12} fill={C.muted}>
        To
      </text>

      <rect x={526} y={284} width={440} height={76} rx={16} fill={C.fill} />
      <Avatar uid={`${uid}-to`} who="account2" x={546} y={302} size={40} />
      <text x={600} y={322} fontSize={24} fontWeight={600} letterSpacing="-0.025em">
        Account 2
      </text>
      <Badge x={720} cy={313} width={82}>
        Your account
      </Badge>
      <GroupedAddress x={600} y={342} who="account2" />

      {ledger && (
        <g>
          <Divider x1={PX + 1} x2={PR - 1} y={384} />
          <Icon name="usb" cx={328} cy={426} size={24} color={C.infoInk} strokeWidth={1.75} />
          <text x={354} y={413} fontWeight={500}>
            Confirm on your Ledger
          </text>
          <text fontSize={12} fill={C.muted}>
            <tspan x={354} y={432}>
              Check that the amount, the recipient and the fee on its screen match this page, then approve it there. To cancel, reject it there. Its
            </tspan>
            <tspan x={354} y={448}>
              Ethereum app may not know Parallax by name: it may call the amount ETH and the network chain 2110.
            </tspan>
          </text>
        </g>
      )}

      <Panel y={rowsY} h={146} />
      <Divider y={rowsY + 49} />
      <Divider y={rowsY + 97} />
      <Avatar uid={`${uid}-from`} who={from} x={1096} y={prop(0) - 10} size={20} />
      <Property cy={prop(0)} label="From">
        {from === "account4" ? "Account 4" : "Account 3"}
      </Property>
      <Property cy={prop(1)} label="Network fee">
        {fee} LAX
        <tspan dx={8} fontSize={12}>
          {gas}
        </tspan>
      </Property>
      <Property cy={prop(2)} label="Total">
        <tspan fontWeight={600} fill={C.fg}>
          {total} LAX
        </tspan>
      </Property>

      <SecondaryButton x={556} y={buttonsY} w={144} h={40} r={12} icon="arrowLeft" iconSize={16} label="Back" labelW={32} disabled={ledger} />
      {ledger ? (
        <PrimaryButton uid={`${uid}-go`} x={712} y={buttonsY} w={224} h={40} r={12} icon="spinner" iconSize={16} label="Confirm on your Ledger…" labelW={150} disabled />
      ) : (
        <PrimaryButton uid={`${uid}-go`} x={712} y={buttonsY} w={224} h={40} r={12} icon="send" iconSize={16} label="Sign and send" labelW={88} focused />
      )}
    </g>
  )
}

export function SendReviewArt(props: ArtProps) {
  return (
    <WalletWindow
      {...props}
      uid="sr"
      nav="send"
      title="Send"
      toolbar={<Steps />}
      page={<SendReviewPage uid="sr-p" from="account3" fee="0.000021" gas="21,000 gas at 1 gwei" total="100.000021" />}
      barSub="Block 60,045 · 9 peers · Up 2m"
    />
  )
}

/* The Review step signed on a Ledger, the page alone: cropped to the
   window's page column. */
export function LedgerArt(props: ArtProps) {
  return (
    <WalletWindow
      {...props}
      uid="lg"
      nav="send"
      title="Send"
      toolbar={<Steps />}
      page={<SendReviewPage uid="lg-p" from="account4" fee="0.000014083021785" gas="21,000 gas at 0.6706 gwei" total="100.000014083021785" ledger />}
      barSub="Block 60,045 · 9 peers · Up 2m"
      view={[265, 53, 967, 739]}
    />
  )
}

/* History (pages/Wallet/History.tsx, Activity.tsx ActivitySection): the
   search, the kinds to show, and the account's activity by day. */
function HistoryPage() {
  const day = (y: number, label: string) => (
    <text x={296} y={y} fontSize={12} fontWeight={600} fill={C.muted}>
      {label}
    </text>
  )
  const kinds = [
    ["All", 335],
    ["Received", 419],
    ["Sent", 503],
    ["Mined", 583],
    ["Failed", 663],
  ] as const
  return (
    <g>
      {/* SearchField */}
      <rect x={PX + 0.5} y={140.5} width={PR - PX - 1} height={39} rx={12} fill={C.surface} stroke={C.glassEdge} />
      <Icon name="search" cx={314} cy={160} color={C.muted} />
      <text x={332} y={164.5} fill={C.faint}>
        Search by contact, address, transaction or block
      </text>

      {/* Segmented: a recessed well, the chosen kind raised and lit */}
      <rect x={PX} y={192} width={414} height={34} rx={10} fill="rgb(255 255 255 / 6%)" />
      <rect x={295} y={195} width={80} height={28} rx={7} fill="rgb(255 255 255 / 16%)" />
      <line x1={302} y1={195.5} x2={368} y2={195.5} stroke="rgb(255 255 255 / 12%)" />
      {kinds.map(([label, cx], i) => (
        <text key={label} x={cx} y={213.5} textAnchor="middle" fontWeight={500} fill={i === 0 ? C.fg : C.muted}>
          {label}
        </text>
      ))}

      {day(250, "Wednesday, October 7")}
      <ActivityPanel y={262} rows={[{ block: "58,553", to: "0xccAF3a…476Eaf", amount: "−10000", when: "10 days ago" }]} />
      {day(360, "Friday, May 1")}
      <ActivityPanel
        y={372}
        rows={["36,455", "36,446", "36,445", "36,444"].map((block) => ({ block, to: "0xc7D3F3…0B3fde", amount: "−1", when: "169 days ago" }))}
      />
      {day(662, "Thursday, April 30")}
      <ActivityPanel y={674} rows={[{ block: "36,391", to: "0xc7D3F3…0B3fde", amount: "−1", when: "169 days ago" }]} />
      {day(772, "Sunday, April 26")}
      <ActivityPanel
        y={784}
        rows={[
          { block: "35,739", to: "0xFE63c1…3A43F3", amount: "−10000", when: "173 days ago" },
          { kind: "canceled", block: "35,738", to: "0xFE63c1…3A43F3", amount: "0", when: "173 days ago" },
        ]}
      />
    </g>
  )
}

/* History's toolbar: a glass pill of going to a date and exporting. */
function HistoryTools() {
  return (
    <g>
      <rect x={1054.5} y={62.5} width={135} height={35} rx={17.5} fill={C.glass} stroke={C.glassEdge} />
      <Icon name="calendarDays" cx={1077} cy={80} />
      <line x1={1100.5} y1={72} x2={1100.5} y2={88} stroke={C.borderStrong} />
      <Icon name="upload" cx={1123} cy={80} />
      <text x={1137} y={84.5} fontWeight={500}>
        Export
      </text>
    </g>
  )
}

export function HistoryArt(props: ArtProps) {
  return <WalletWindow {...props} uid="hi" nav="history" title="History" toolbar={<HistoryTools />} page={<HistoryPage />} barSub="Block 60,045 · 10 peers · Up 3s" />
}

/* btn-ghost: the label alone, muted. */
function GhostButton({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <text x={x + 14} y={y + 21.5} fontWeight={500} fill={C.muted}>
      {label}
    </text>
  )
}

/* An assistant asks to see the wallet (AssistantRequests.tsx Permission). */
export function AssistantPermissionArt(props: ArtProps) {
  const x0 = 782
  return (
    <WalletWindow
      {...props}
      uid="ap"
      nav="overview"
      title="Overview"
      page={<OverviewPage uid="ap-p" balanceAt="60,046" />}
      barRight={750}
      barSub="Block 60,046 · 9 peers · Up 3m"
      overlay={(under) => (
        <AssistantPanel uid="ap-req" under={under} x={762} y={593} icon="shieldCheck" title="Let an assistant see your wallet?" footerY={848}>
          <text x={x0} y={686} fill={C.muted}>
            An AI assistant wants to use
          </text>
          <Badge x={957} cy={682} width={117} mono>
            wallet_accounts
          </Badge>

          <rect x={x0} y={709} width={PR - x0} height={71} rx={8} fill={C.inset} />
          <Icon name="shieldCheck" cx={805} cy={727} size={20} color={C.brand} strokeWidth={1.75} />
          <text x={827} y={731} fontWeight={500}>
            Wallet
          </text>
          <text fontSize={12} fill={C.muted}>
            <tspan x={827} y={750}>
              Your accounts, their names, balances and activity, tying your
            </tspan>
            <tspan x={827} y={766}>
              addresses together.
            </tspan>
          </text>

          <text fontSize={12} fill={C.muted}>
            <tspan x={x0} y={808}>
              Allow once lets this assistant use it until it disconnects. Always allow sets it
            </tspan>
            <tspan x={x0} y={824}>
              to Allow in Settings › AI assistants › Permissions, for every assistant.
            </tspan>
          </text>

          <GhostButton x={x0} y={860} label="Don’t allow" />
          <SecondaryButton x={972} y={860} w={108} label="Always allow" labelW={78} />
          <PrimaryButton uid="ap-once" x={1088} y={860} w={112} icon="check" label="Allow once" labelW={66} />
        </AssistantPanel>
      )}
    />
  )
}

/* An assistant asks to send (AssistantRequests.tsx Transaction): what
   leaves, where to, the costs, its reason, and the password to sign with. */
export function AssistantSendArt(props: ArtProps) {
  const x0 = 702
  const prop = (i: number) => 463 + i * 48
  return (
    <WalletWindow
      {...props}
      uid="as"
      nav="overview"
      title="Overview"
      page={<OverviewPage uid="as-p" balanceAt="60,046" />}
      barRight={670}
      barSub="Block 60,046 · 9 peers · Up 4m"
      overlay={(under) => (
        <AssistantPanel uid="as-req" under={under} x={682} y={183} icon="send" title="Send 100 LAX?" footerY={848}>
          <Figure uid="as-req" x={951} y={308} size={48} unitSize={24} value="100" anchor="middle" box={[890, 266, 980, 312]} />
          <Icon name="arrowDown" cx={940} cy={335} size={14} color={C.muted} />
          <text x={954} y={339} fontSize={12} fill={C.muted}>
            To
          </text>

          {/* The party: one of the wallet's accounts */}
          <rect x={x0} y={363} width={PR - x0} height={58} rx={8} fill={C.inset} />
          <Avatar uid="as-to" who="account1" x={715} y={377} size={30} />
          <text x={757} y={387.5} fontWeight={500}>
            Account 1
          </text>
          <Badge x={825} cy={383} width={82}>
            Your account
          </Badge>
          <GroupedAddress x={757} y={407} who="account1" />

          <Panel x={x0} y={438} w={PR - x0} h={194} />
          {[1, 2, 3].map((i) => (
            <Divider key={i} x1={x0 + 1} x2={PR - 1} y={438 + i * 48} />
          ))}
          <Avatar uid="as-from" who="account3" x={1011} y={prop(0) - 10} size={20} />
          <Property cy={prop(0)} label="From" x1={722} x2={1180}>
            Account 3
            <tspan dx={6} fontFamily={MONO} fontSize={12}>
              0x17aC…F8ca
            </tspan>
          </Property>
          <Property cy={prop(1)} label="Network fee" x1={722} x2={1180}>
            0.000021 LAX
            <tspan dx={8} fontSize={12}>
              21,000 gas at 1 gwei
            </tspan>
          </Property>
          <Property cy={prop(2)} label="Total" x1={722} x2={1180}>
            <tspan fontWeight={600} fill={C.fg}>
              100.000021 LAX
            </tspan>
          </Property>
          <Property cy={prop(3)} label="Balance after" x1={722} x2={1180}>
            6,873.075089067454046 LAX
          </Property>

          {/* The assistant's reason, as its own words in a bubble */}
          <circle cx={718} cy={662} r={16} fill={C.brandMuted} />
          <Sparkles cx={718} cy={662} size={16} color={C.brand} />
          <path d="M752 646h348a16 16 0 0 1 16 16v21a16 16 0 0 1-16 16H762a16 16 0 0 1-16-16V652a6 6 0 0 1 6-6z" fill={C.inset} />
          <text x={759} y={666} fontSize={11} fontWeight={500} fill={C.muted}>
            The assistant says
          </text>
          <text x={759} y={686} fillOpacity={0.85}>
            “You asked to send 100 LAX from Account 3 to Account 1.”
          </text>

          <text x={x0} y={728} fontSize={12} fill={C.muted}>
            Assistants can be misled by what they read. Approve only what you meant to ask for.
          </text>
          <text x={x0} y={761.5} fontWeight={500}>
            Wallet password
          </text>
          <rect x={x0 + 0.5} y={773.5} width={PR - x0 - 1} height={33} rx={10} fill={C.surface} stroke={C.glassEdge} />
          <Icon name="eye" cx={1184} cy={790} size={16} color={C.muted} />
          <text x={x0} y={824} fontSize={12} fill={C.muted}>
            Signs this transaction. It goes to the wallet, never to the assistant.
          </text>

          <SecondaryButton x={964} y={860} w={96} label="Don’t allow" labelW={68} />
          <PrimaryButton uid="as-go" x={1068} y={860} w={W - 32 - 1068} icon="send" label="Sign and send" labelW={86} disabled />
        </AssistantPanel>
      )}
    />
  )
}
