export type Locale = 'zh' | 'en'

export const LOCALES: Locale[] = ['zh', 'en']
export const LOCALE_LABELS: Record<Locale, string> = { zh: '中文', en: 'EN' }

export type Messages = typeof zh

export const zh = {
  // Header
  brand: 'MARK',
  todayMarked: '今日已留痕',
  notMarked: '尚未留痕',

  // Mark button — streak
  streakUnit: '天',
  streakSub: '不间断',

  // Mark button — label (before / after)
  callToAction: '在这个日子留下印记',
  doneCta: '已留痕，明日继续',

  // Mark button — body description (below button, in card)
  cardDesc: '时间不会记得你，\n但你可以记得自己。',

  // Stats labels
  statTotal: '总印记',
  statLongest: '最长连续',
  statDayOfYear: '今日是第',
  statDayUnit: '天',
  statRemaining: '剩余',

  // Year grid header
  gridYear: (y: number) => `${y}`,
  gridSub: '每个格子，都是你出现过的证明',
  gridCount: (checked: number, total: number) => `${checked} / ${total}`,

  // Legend
  legendPastMissed: '错过',
  legendChecked: '留痕',
  legendFuture: '未至',
  legendToday: '今天',

  // Month strip
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

  // Footer
  footerTagline: '每一天都算数',

  // Year progress tooltip
  yearProgressLabel: (pct: number) => `这一年已走过 ${pct}%`,
}

export const en: Messages = {
  brand: 'MARK',
  todayMarked: 'Marked today',
  notMarked: 'Not yet',

  streakUnit: '',
  streakSub: 'day streak',

  callToAction: 'Leave your mark today',
  doneCta: 'Marked. See you tomorrow.',

  cardDesc: 'Time won\'t remember you.\nBut you can remember yourself.',

  statTotal: 'Total',
  statLongest: 'Longest',
  statDayOfYear: 'Day',
  statDayUnit: '',
  statRemaining: 'Left',

  gridYear: (y: number) => `${y}`,
  gridSub: 'Every square is proof you showed up',
  gridCount: (checked: number, total: number) => `${checked} / ${total}`,

  legendPastMissed: 'Missed',
  legendChecked: 'Marked',
  legendFuture: 'Ahead',
  legendToday: 'Today',

  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

  footerTagline: 'Every day counts.',

  yearProgressLabel: (pct: number) => `${pct}% of the year behind you`,
}

export const messages: Record<Locale, Messages> = { zh, en }

export function detectLocale(): Locale {
  if (typeof navigator === 'undefined') return 'zh'
  const lang = navigator.language.toLowerCase()
  if (lang.startsWith('zh')) return 'zh'
  return 'en'
}
