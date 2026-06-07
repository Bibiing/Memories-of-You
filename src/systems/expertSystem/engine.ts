import type { ExpertSystemContext, SystemOutput } from './types'
import { ruleBase } from '@data/ruleBase'

export function evaluateNight(ctx: ExpertSystemContext): SystemOutput[] {
  const applicable = ruleBase
    .filter((rule) => {
      const chapterMatch = rule.chapter === 'any' || rule.chapter === ctx.chapter
      return chapterMatch && rule.condition(ctx)
    })
    .sort((a, b) => b.priority - a.priority)

  return applicable.map((rule) => rule.action(ctx))
}

export function checkChapterTransition(ctx: ExpertSystemContext): boolean {
  const transitionRules = ruleBase.filter(
    (r) =>
      (r.chapter === 'any' || r.chapter === ctx.chapter) &&
      r.condition(ctx) &&
      r.action(ctx).type === 'chapter-transition'
  )
  return transitionRules.length > 0
}

export function checkNPCIntervention(ctx: ExpertSystemContext): boolean {
  return ctx.daysInChapter >= 7
}

export function getNextChapter(ctx: ExpertSystemContext): string | null {
  const rules = ruleBase
    .filter((r) => (r.chapter === 'any' || r.chapter === ctx.chapter) && r.condition(ctx))
    .map((r) => r.action(ctx))
    .filter((output) => output.type === 'chapter-transition')

  const first = rules[0]
  return first?.nextChapter ?? null
}
