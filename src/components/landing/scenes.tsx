/**
 * Editorial scene illustrations for the suite landing page.
 *
 * These stand in for the photo prompts in the build brief: warm-neutral,
 * no readable text or logos, light-blue screens against ivory/sand tones so
 * the single #1a73e8 accent and the wordmark stay the only saturated color
 * moments on the page. All scenes share one vocabulary (wall wash, window
 * light, desk band, soft warm shadows) so they read as one shoot.
 */

import type { ReactNode } from 'react'

const INK_SHADOW = '#3e3726'

function SceneFrame({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: ReactNode
}) {
  return (
    <svg
      viewBox="0 0 960 540"
      role="img"
      aria-label={label}
      className="block h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf9f3" />
          <stop offset="1" stopColor="#f2ecdf" />
        </linearGradient>
        <linearGradient id={`${id}-desk`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8ddc6" />
          <stop offset="1" stopColor="#d9cbae" />
        </linearGradient>
      </defs>
      <rect width="960" height="540" fill={`url(#${id}-wall)`} />
      {/* window light falling across the wall */}
      <polygon points="40,0 330,0 210,540 0,540 0,120" fill="#fffdf4" opacity="0.4" />
      <polygon points="380,0 470,0 330,540 250,540" fill="#fffdf4" opacity="0.22" />
      {/* desk */}
      <rect y="396" width="960" height="144" fill={`url(#${id}-desk)`} />
      <rect y="396" width="960" height="4" fill="#f0e6d0" />
      {children}
    </svg>
  )
}

/** Hero: sunlit desk, laptop showing a calm dashboard, notebook, coffee. */
export function HeroScene() {
  return (
    <SceneFrame
      id="hs"
      label="A calm, sunlit desk with a laptop showing a minimal dashboard, a notebook, and a cup of coffee"
    >
      {/* laptop */}
      <ellipse cx="545" cy="472" rx="250" ry="18" fill={INK_SHADOW} opacity="0.1" />
      <rect x="375" y="140" width="340" height="228" rx="14" fill="#47433a" />
      <rect x="387" y="152" width="316" height="204" rx="6" fill="#ffffff" />
      {/* dashboard: sidebar */}
      <rect x="387" y="152" width="64" height="204" rx="6" fill="#f4f7fd" />
      <rect x="401" y="174" width="36" height="6" rx="3" fill="#1a73e8" opacity="0.85" />
      <rect x="401" y="196" width="36" height="6" rx="3" fill="#d7e3f8" />
      <rect x="401" y="218" width="36" height="6" rx="3" fill="#d7e3f8" />
      <rect x="401" y="240" width="36" height="6" rx="3" fill="#d7e3f8" />
      {/* dashboard: header + stat tiles */}
      <rect x="463" y="166" width="90" height="8" rx="4" fill="#dfe6f2" />
      {[463, 543, 623].map((x) => (
        <g key={x}>
          <rect x={x} y="186" width="68" height="40" rx="6" fill="#f3f6fc" />
          <rect x={x + 10} y="196" width="32" height="5" rx="2.5" fill="#c4d7f7" />
          <rect x={x + 10} y="208" width="20" height="8" rx="3" fill="#8fb4f0" />
        </g>
      ))}
      {/* dashboard: line chart */}
      <rect x="463" y="238" width="228" height="74" rx="6" fill="#f7fafe" />
      <path
        d="M470,300 L500,282 L530,290 L565,266 L600,272 L640,252 L680,258 L680,306 L470,306 Z"
        fill="#dce9fc"
        opacity="0.9"
      />
      <polyline
        points="470,300 500,282 530,290 565,266 600,272 640,252 680,258"
        fill="none"
        stroke="#1a73e8"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="640" cy="252" r="3.5" fill="#1a73e8" />
      {/* dashboard: rows */}
      <rect x="463" y="322" width="228" height="8" rx="4" fill="#eef1f7" />
      <rect x="463" y="338" width="176" height="8" rx="4" fill="#eef1f7" />
      {/* hinge + base */}
      <rect x="373" y="366" width="344" height="6" rx="3" fill="#b9b19e" />
      <path d="M330,372 L760,372 L790,404 L300,404 Z" fill="#e2dbc9" />
      <rect x="505" y="380" width="80" height="14" rx="5" fill="#d5cdb7" />
      {/* notebook + pen */}
      <ellipse cx="205" cy="522" rx="98" ry="9" fill={INK_SHADOW} opacity="0.08" />
      <g transform="rotate(-5 205 470)">
        <rect x="120" y="418" width="170" height="104" rx="8" fill="#fffdf6" stroke="#ece2cb" />
        {[444, 462, 480, 498].map((y) => (
          <rect key={y} x="152" y={y} width="112" height="3" rx="1.5" fill="#ece4d0" />
        ))}
        {[434, 450, 466, 482, 498].map((y) => (
          <circle key={y} cx="134" cy={y} r="3.5" fill="none" stroke="#cfc4a9" strokeWidth="1.5" />
        ))}
      </g>
      <g transform="rotate(14 330 500)">
        <rect x="286" y="496" width="88" height="7" rx="3.5" fill="#8b8578" />
        <polygon points="374,496 388,499.5 374,503" fill="#6e6a5f" />
      </g>
      {/* coffee */}
      <ellipse cx="818" cy="506" rx="46" ry="8" fill={INK_SHADOW} opacity="0.1" />
      <circle cx="858" cy="464" r="16" fill="none" stroke="#f1e7d1" strokeWidth="10" />
      <rect x="778" y="428" width="76" height="74" rx="11" fill="#fffdf6" />
      <ellipse cx="816" cy="432" rx="37" ry="9" fill="#fbf6ea" />
      <ellipse cx="816" cy="432" rx="29" ry="6.5" fill="#ac7c4c" />
      <path
        d="M801,412 C796,400 807,394 802,382"
        fill="none"
        stroke="#e2d5b8"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M829,410 C824,398 835,392 830,380"
        fill="none"
        stroke="#e2d5b8"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
    </SceneFrame>
  )
}

/** Pain 1: too many tools — window-cluttered laptop, sticky notes, chat phone. */
export function ClutterScene() {
  return (
    <SceneFrame
      id="cs"
      label="A cluttered desk: a laptop crowded with overlapping windows, sticky notes, and a phone full of messages"
    >
      {/* laptop */}
      <ellipse cx="365" cy="474" rx="260" ry="18" fill={INK_SHADOW} opacity="0.1" />
      <rect x="150" y="104" width="430" height="276" rx="14" fill="#47433a" />
      <rect x="163" y="117" width="404" height="250" rx="6" fill="#fbfaf6" />
      {/* overlapping app windows */}
      <g>
        <rect x="181" y="140" width="200" height="126" rx="8" fill={INK_SHADOW} opacity="0.05" />
        <rect x="177" y="136" width="200" height="126" rx="8" fill="#ffffff" stroke="#e5e0d2" />
        <rect x="177" y="136" width="200" height="20" rx="8" fill="#f0ede4" />
        <rect x="190" y="168" width="150" height="6" rx="3" fill="#e7e3d8" />
        <rect x="190" y="184" width="170" height="6" rx="3" fill="#eeebe1" />
        <rect x="190" y="200" width="130" height="6" rx="3" fill="#eeebe1" />
        <rect x="190" y="216" width="160" height="6" rx="3" fill="#eeebe1" />
      </g>
      <g>
        <rect x="338" y="152" width="196" height="122" rx="8" fill={INK_SHADOW} opacity="0.05" />
        <rect x="334" y="148" width="196" height="122" rx="8" fill="#ffffff" stroke="#e5e0d2" />
        <rect x="334" y="148" width="196" height="20" rx="8" fill="#f0ede4" />
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={350 + (i % 2) * 86}
            y={180 + Math.floor(i / 2) * 42}
            width="72"
            height="32"
            rx="5"
            fill="#eef2f9"
          />
        ))}
      </g>
      <g>
        <rect x="248" y="196" width="210" height="150" rx="8" fill={INK_SHADOW} opacity="0.06" />
        <rect x="244" y="192" width="210" height="150" rx="8" fill="#ffffff" stroke="#e5e0d2" />
        <rect x="244" y="192" width="210" height="20" rx="8" fill="#f0ede4" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={262 + i * 36}
            y={318 - i * 14 - (i % 2) * 8}
            width="18"
            height={14 + i * 14 + (i % 2) * 8}
            rx="3"
            fill="#c8d9f6"
          />
        ))}
        <circle cx="440" cy="206" r="5" fill="#1a73e8" opacity="0.8" />
      </g>
      {/* hinge + base */}
      <rect x="148" y="378" width="434" height="6" rx="3" fill="#b9b19e" />
      <path d="M110,384 L620,384 L652,416 L78,416 Z" fill="#e2dbc9" />
      {/* sticky notes on the bezel and desk */}
      <g transform="rotate(6 562 182)">
        <rect x="540" y="160" width="46" height="46" rx="3" fill="#f6e3ae" />
        <rect x="548" y="174" width="30" height="3" rx="1.5" fill="#bfa96e" />
        <rect x="548" y="184" width="24" height="3" rx="1.5" fill="#bfa96e" />
      </g>
      <g transform="rotate(-5 560 250)">
        <rect x="537" y="227" width="46" height="46" rx="3" fill="#f2dcc0" />
        <rect x="545" y="241" width="28" height="3" rx="1.5" fill="#bb9d74" />
        <rect x="545" y="251" width="32" height="3" rx="1.5" fill="#bb9d74" />
      </g>
      <g transform="rotate(8 655 452)">
        <rect x="632" y="429" width="50" height="50" rx="3" fill="#f6e3ae" />
        <rect x="641" y="444" width="32" height="3" rx="1.5" fill="#bfa96e" />
        <rect x="641" y="454" width="26" height="3" rx="1.5" fill="#bfa96e" />
      </g>
      {/* loose papers */}
      <g transform="rotate(-7 140 470)">
        <rect x="62" y="440" width="150" height="86" rx="4" fill="#fffdf5" stroke="#ece2cb" />
        <rect x="78" y="458" width="100" height="4" rx="2" fill="#e9dfc8" />
        <rect x="78" y="472" width="116" height="4" rx="2" fill="#efe7d3" />
        <rect x="78" y="486" width="88" height="4" rx="2" fill="#efe7d3" />
      </g>
      {/* phone with a messaging app */}
      <ellipse cx="768" cy="512" rx="70" ry="9" fill={INK_SHADOW} opacity="0.1" />
      <g transform="rotate(7 760 480)">
        <rect x="712" y="398" width="98" height="172" rx="16" fill="#47433a" />
        <rect x="719" y="405" width="84" height="158" rx="10" fill="#ffffff" />
        <rect x="727" y="418" width="46" height="14" rx="7" fill="#efece4" />
        <rect x="749" y="440" width="46" height="14" rx="7" fill="#d7e5fc" />
        <rect x="727" y="462" width="54" height="14" rx="7" fill="#efece4" />
        <rect x="743" y="484" width="52" height="14" rx="7" fill="#d7e5fc" />
        <rect x="727" y="506" width="40" height="14" rx="7" fill="#efece4" />
        <circle cx="734" cy="537" r="2.5" fill="#b8b2a4" />
        <circle cx="743" cy="537" r="2.5" fill="#b8b2a4" />
        <circle cx="752" cy="537" r="2.5" fill="#b8b2a4" />
      </g>
      {/* small mug far right */}
      <circle cx="909" cy="448" r="11" fill="none" stroke="#f1e7d1" strokeWidth="7" />
      <rect x="854" y="422" width="52" height="54" rx="9" fill="#fffdf6" />
      <ellipse cx="880" cy="425" rx="25" ry="6" fill="#ac7c4c" />
    </SceneFrame>
  )
}

/** Pain 2: starting from scratch — blank browser and a half-finished sketch. */
export function BlankSiteScene() {
  return (
    <SceneFrame
      id="bs"
      label="A laptop showing an empty browser window next to a half-finished paper sketch of a website layout"
    >
      {/* laptop */}
      <ellipse cx="335" cy="472" rx="255" ry="18" fill={INK_SHADOW} opacity="0.1" />
      <rect x="120" y="108" width="430" height="278" rx="14" fill="#47433a" />
      <rect x="133" y="121" width="404" height="252" rx="6" fill="#ffffff" />
      {/* browser chrome */}
      <path d="M133,127 a6,6 0 0 1 6,-6 h392 a6,6 0 0 1 6,6 v28 h-404 Z" fill="#f4f1e9" />
      <circle cx="152" cy="138" r="5" fill="#dcd6c6" />
      <circle cx="169" cy="138" r="5" fill="#dcd6c6" />
      <circle cx="186" cy="138" r="5" fill="#dcd6c6" />
      <rect x="206" y="129" width="256" height="18" rx="9" fill="#ffffff" stroke="#e7e3d8" />
      {/* blank canvas, blinking-cursor moment */}
      <rect x="178" y="192" width="3" height="28" rx="1.5" fill="#201e19" opacity="0.75" />
      {/* hinge + base */}
      <rect x="118" y="384" width="434" height="6" rx="3" fill="#b9b19e" />
      <path d="M80,390 L590,390 L622,420 L48,420 Z" fill="#e2dbc9" />
      {/* paper wireframe sketch */}
      <ellipse cx="748" cy="516" rx="120" ry="10" fill={INK_SHADOW} opacity="0.08" />
      <g transform="rotate(4 748 472)">
        <rect x="640" y="400" width="216" height="144" rx="6" fill="#fffdf6" stroke="#ece2cb" />
        <g fill="none" stroke="#a89e86" strokeWidth="2" strokeLinecap="round">
          <rect x="660" y="416" width="176" height="18" rx="3" />
          <rect x="660" y="444" width="102" height="42" rx="3" />
          <path d="M774,450 h56 M774,460 h46 M774,470 h52" />
          <rect x="660" y="496" width="52" height="34" rx="3" />
          <rect x="722" y="496" width="52" height="34" rx="3" strokeDasharray="5 5" />
          <path d="M786,502 h46" strokeDasharray="5 5" />
          <path d="M786,514 h34" strokeDasharray="5 5" />
        </g>
      </g>
      {/* pencil */}
      <g transform="rotate(-14 828 530)">
        <rect x="768" y="524" width="112" height="9" rx="2" fill="#dcbe8a" />
        <polygon points="880,524 898,528.5 880,533" fill="#efe4cc" />
        <polygon points="892,526.5 898,528.5 892,530.5" fill="#57534a" />
        <rect x="768" y="524" width="10" height="9" rx="2" fill="#c4a06a" />
      </g>
    </SceneFrame>
  )
}

/** Pain 3: scrolling for trends — hand holding a phone with a product grid. */
export function ScrollScene() {
  return (
    <svg
      viewBox="0 0 960 540"
      role="img"
      aria-label="A hand holding a phone showing a grid of product thumbnails at a kitchen table"
      className="block h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="ps-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f9f5ea" />
          <stop offset="1" stopColor="#efe6d2" />
        </linearGradient>
        <linearGradient id="ps-table" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3d2ae" />
          <stop offset="1" stopColor="#d5c093" />
        </linearGradient>
        <filter id="ps-blur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <rect width="960" height="540" fill="url(#ps-wall)" />
      {/* blurred kitchen background for shallow depth of field */}
      <g filter="url(#ps-blur)">
        <rect x="600" y="30" width="280" height="230" rx="10" fill="#fdfbf2" opacity="0.85" />
        <rect x="40" y="120" width="200" height="180" rx="8" fill="#e7dcbf" opacity="0.7" />
        <rect x="0" y="290" width="960" height="70" fill="#e0d2ab" />
        <circle cx="160" cy="330" r="34" fill="#d8c69a" />
        <rect x="700" y="286" width="90" height="70" rx="8" fill="#efe7d0" />
      </g>
      {/* table */}
      <rect y="352" width="960" height="188" fill="url(#ps-table)" />
      <path d="M0,392 q240,10 480,0 t480,4" fill="none" stroke="#c9b485" strokeWidth="2" opacity="0.35" />
      <path d="M0,462 q300,-12 600,0 t360,-4" fill="none" stroke="#c9b485" strokeWidth="2" opacity="0.3" />
      {/* phone shadow */}
      <ellipse cx="495" cy="502" rx="170" ry="18" fill={INK_SHADOW} opacity="0.14" />
      {/* fingers gripping the left edge */}
      <ellipse cx="402" cy="248" rx="17" ry="13" fill="#ecd0ae" />
      <ellipse cx="399" cy="298" rx="18" ry="13" fill="#ecd0ae" />
      <ellipse cx="399" cy="348" rx="18" ry="13" fill="#ecd0ae" />
      <ellipse cx="402" cy="396" rx="17" ry="13" fill="#ecd0ae" />
      {/* phone */}
      <g transform="rotate(-3 490 300)">
        <rect x="402" y="112" width="180" height="352" rx="24" fill="#3f3b33" />
        <rect x="412" y="122" width="160" height="332" rx="14" fill="#ffffff" />
        <rect x="424" y="136" width="136" height="16" rx="8" fill="#f1efe8" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const x = 424 + (i % 2) * 72
          const y = 164 + Math.floor(i / 2) * 94
          return (
            <g key={i}>
              <rect x={x} y={y} width="64" height="84" rx="8" fill="#f7f6f2" stroke="#eceae2" />
              {i % 3 === 0 && <circle cx={x + 32} cy={y + 30} r="17" fill="#ccd7e8" />}
              {i % 3 === 1 && <rect x={x + 22} y={y + 12} width="20" height="36" rx="6" fill="#ccd7e8" />}
              {i % 3 === 2 && <path d={`M${x + 18},${y + 44} L${x + 32} ${y + 12} L${x + 46},${y + 44} Z`} fill="#ccd7e8" />}
              <rect x={x + 10} y={y + 56} width="44" height="5" rx="2.5" fill="#e3e1d8" />
              <rect x={x + 10} y={y + 66} width="26" height="7" rx="3.5" fill="#cfe0f8" />
            </g>
          )
        })}
      </g>
      {/* thumb over the right edge + palm below */}
      <path
        d="M556,466 C548,430 552,392 566,372 C576,358 598,362 602,382 C608,414 598,452 590,486 L586,540 L544,540 Z"
        fill="#ecd0ae"
      />
      <path d="M420,462 L572,470 L590,540 L400,540 Z" fill="#e7c9a4" />
    </svg>
  )
}

/** Pain 4: no time for content — ring light and phone tripod sitting idle. */
export function RingLightScene() {
  return (
    <SceneFrame id="rs" label="A ring light and an empty phone tripod standing unused on a desk">
      <defs>
        <radialGradient id="rs-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fffef7" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fffef7" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* ring light */}
      <ellipse cx="356" cy="512" rx="130" ry="12" fill={INK_SHADOW} opacity="0.1" />
      <circle cx="356" cy="212" r="96" fill="url(#rs-glow)" />
      <circle cx="356" cy="212" r="96" fill="none" stroke="#efe6d2" strokeWidth="26" />
      <circle cx="356" cy="212" r="110" fill="none" stroke="#e3d7bc" strokeWidth="2" />
      <circle cx="356" cy="212" r="82" fill="none" stroke="#e3d7bc" strokeWidth="2" />
      {/* empty phone holder in the ring's center */}
      <rect x="342" y="188" width="28" height="48" rx="7" fill="none" stroke="#57534a" strokeWidth="5" />
      <rect x="352" y="322" width="8" height="146" rx="4" fill="#57534a" />
      <g stroke="#57534a" strokeWidth="9" strokeLinecap="round">
        <line x1="356" y1="464" x2="298" y2="522" />
        <line x1="356" y1="464" x2="414" y2="522" />
        <line x1="356" y1="464" x2="356" y2="526" />
      </g>
      {/* small phone tripod, clamp empty */}
      <ellipse cx="648" cy="516" rx="66" ry="8" fill={INK_SHADOW} opacity="0.09" />
      <rect x="644" y="408" width="7" height="76" rx="3.5" fill="#6e6a5f" />
      <g stroke="#6e6a5f" strokeWidth="7" strokeLinecap="round">
        <line x1="647" y1="482" x2="612" y2="518" />
        <line x1="647" y1="482" x2="682" y2="518" />
        <line x1="647" y1="482" x2="647" y2="522" />
      </g>
      <path
        d="M628,408 h38 M628,408 v-14 M666,408 v-14"
        fill="none"
        stroke="#6e6a5f"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* coiled cable, waiting */}
      <path
        d="M770,506 c-12,-20 34,-27 29,-7 c-5,18 -38,11 -31,-9 c6,-16 34,-13 34,3"
        fill="none"
        stroke="#b8ad94"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* closed notebooks stacked, untouched */}
      <rect x="96" y="486" width="150" height="14" rx="4" fill="#e8dcc2" />
      <rect x="106" y="470" width="150" height="16" rx="4" fill="#fffdf6" stroke="#ece2cb" />
    </SceneFrame>
  )
}

/** Trust section: a hand adjusting a single toggle on a calm settings screen. */
export function ControlScene() {
  return (
    <svg
      viewBox="0 0 960 540"
      role="img"
      aria-label="A hand adjusting a toggle on a tablet showing a minimal settings screen"
      className="block h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="ts-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#faf7f0" />
          <stop offset="1" stopColor="#f0e9d9" />
        </linearGradient>
        <filter id="ts-blur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <rect width="960" height="540" fill="url(#ts-wall)" />
      <g filter="url(#ts-blur)">
        <circle cx="130" cy="90" r="90" fill="#fffdf2" opacity="0.9" />
        <rect x="700" y="60" width="220" height="160" rx="12" fill="#eee5cf" opacity="0.8" />
        <rect x="0" y="440" width="960" height="100" fill="#e4d9bf" />
      </g>
      {/* tablet */}
      <g transform="rotate(-2 480 280)">
        <rect x="196" y="88" width="568" height="388" rx="26" fill="#46423a" />
        <rect x="212" y="104" width="536" height="356" rx="14" fill="#fdfdfa" />
        <rect x="248" y="136" width="128" height="12" rx="6" fill="#e8e4d8" />
        {[
          { y: 196, on: false, touched: false },
          { y: 262, on: true, touched: false },
          { y: 328, on: true, touched: true },
          { y: 394, on: false, touched: false },
        ].map(({ y, on, touched }) => (
          <g key={y}>
            <circle cx="272" cy={y} r="15" fill="#eef2f9" />
            <rect x="304" y={y - 10} width="164" height="10" rx="5" fill="#e6e2d6" />
            <rect x="304" y={y + 4} width="104" height="7" rx="3.5" fill="#efece4" />
            {touched && <circle cx="668" cy={y} r="30" fill="#1a73e8" opacity="0.14" />}
            <rect
              x="640"
              y={y - 16}
              width="56"
              height="32"
              rx="16"
              fill={on ? '#1a73e8' : '#dcd8ca'}
            />
            <circle cx={on ? 680 : 656} cy={y} r="12" fill="#ffffff" />
          </g>
        ))}
      </g>
      {/* hand reaching in from the lower right, finger on the third toggle */}
      <path
        d="M666,338 C660,320 672,306 688,312 C700,317 706,330 702,344 C716,384 736,452 754,540 L620,540 C632,462 650,392 666,338 Z"
        fill="#ecd0ae"
      />
      <path
        d="M712,420 C726,408 744,412 750,428 C756,444 748,458 736,464 L748,540 L700,540 Z"
        fill="#e7c9a4"
      />
      <ellipse cx="686" cy="326" rx="15" ry="19" fill="#f2d9b8" />
    </svg>
  )
}
