import { useGid } from '../colors'
import { DriftCloud, H, W } from './shared'

function Tower({ x, y, w, h, roof, id }: { x: number; y: number; w: number; h: number; roof: number; id: string }) {
  return (
    <g strokeLinejoin="round">
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id}w)`} stroke="#B58BBF" strokeWidth={1.4} />
      <path d={`M${x - 3} ${y} L${x + w / 2} ${y - roof} L${x + w + 3} ${y} Z`} fill={`url(#${id}r)`} stroke="#A04E86" strokeWidth={1.4} />
      <path d={`M${x + w / 2 - 2.5} ${y + 12} q2.5 -4 5 0 v8 h-5 Z`} fill="#6a4a86" />
      <path d={`M${x + w / 2} ${y - roof} v-9`} stroke="#6a4a86" strokeWidth={1.4} />
      <path d={`M${x + w / 2} ${y - roof - 9} h8 l-2.5 3 l2.5 3 h-8 Z`} fill="#FFD43B" stroke="#C99700" strokeWidth={0.8} />
    </g>
  )
}

/** Fairy-tale castle on a green hill under a pink and blue sky. */
export function Castle() {
  const id = useGid()
  return (
    <g>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8FB4F2" />
          <stop offset="0.55" stopColor="#D9C3F4" />
          <stop offset="1" stopColor="#FFE3EE" />
        </linearGradient>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFF4FA" />
          <stop offset="1" stopColor="#E9D4EF" />
        </linearGradient>
        <linearGradient id={`${id}r`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F77FB5" />
          <stop offset="1" stopColor="#D9508F" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#93DA82" />
          <stop offset="1" stopColor="#4FAE5B" />
        </linearGradient>
        <linearGradient id={`${id}g2`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#74CC6F" />
          <stop offset="1" stopColor="#3C9C4B" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}s)`} />
      <DriftCloud y={40} scale={1.1} duration={85} delay={-30} tint="#FFF6FB" />
      <DriftCloud y={82} scale={0.7} duration={105} delay={-60} opacity={0.45} tint="#FFF6FB" />
      {/* castle on its hill */}
      <path d="M170 140 C200 110 270 108 330 140 Z" fill={`url(#${id}g)`} />
      <g>
        <Tower x={222} y={80} w={18} h={52} roof={24} id={id} />
        <Tower x={296} y={82} w={18} h={50} roof={22} id={id} />
        <rect x={238} y={96} width={60} height={38} fill={`url(#${id}w)`} stroke="#B58BBF" strokeWidth={1.4} />
        <path d="M238 96 h6 v-5 h6 v5 h6 v-5 h6 v5 h6 v-5 h6 v5 h6 v-5 h6 v5 h6" fill="none" stroke="#B58BBF" strokeWidth={1.4} />
        <Tower x={258} y={62} w={20} h={40} roof={26} id={id} />
        <path d="M259 134 v-12 a7 7 0 0 1 14 0 v12 Z" fill="#7a4f93" stroke="#5e3a74" strokeWidth={1.2} transform="translate(5 0)" />
        <rect x={242} y={108} width={6} height={9} rx={3} fill="#7a4f93" />
        <rect x={288} y={108} width={6} height={9} rx={3} fill="#7a4f93" />
        <rect x={263} y={72} width={6} height={10} rx={3} fill="#FFD76A" />
      </g>
      {/* hills */}
      <path d="M0 132 C50 112 110 120 160 138 C210 150 240 146 270 142 L330 140 C360 130 380 128 400 132 V240 H0 Z" fill={`url(#${id}g2)`} />
      <path d="M0 132 C50 112 110 120 160 138" fill="none" stroke="#C3F0B2" strokeWidth={2.2} opacity={0.7} />
      <path d="M0 162 C100 152 200 164 300 156 C350 152 380 158 400 156 V240 H0 Z" fill={`url(#${id}g)`} />
      {/* winding road to the castle */}
      <path d="M262 142 C250 156 215 164 195 180 C170 198 150 218 140 240 L190 240 C200 218 225 204 250 192 C276 180 290 164 278 142 Z" fill="#F6E3C0" opacity={0.9} />
      {/* bunting */}
      <path d="M0 24 Q100 60 200 28 T400 24" fill="none" stroke="#B58BBF" strokeWidth={1.2} />
      {[28, 70, 112, 156, 202, 248, 294, 340, 384].map((x, i) => (
        <path key={x} d={`M${x} ${[28, 41, 50, 46, 30, 36, 40, 30, 25][i]} l5 11 l5 -11 Z`} fill={['#FF8FB8', '#FFD43B', '#7DD3FC', '#A78BFA'][i % 4]} />
      ))}
    </g>
  )
}
