/**
 * Returns true when the event target is a focusable form element,
 * so keyboard handlers can skip their bindings and not interfere with typing.
 */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!target) return false
  const el = target as HTMLElement
  const tag = el.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable
}
