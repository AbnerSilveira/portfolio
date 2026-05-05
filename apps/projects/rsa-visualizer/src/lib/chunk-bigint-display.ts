/** Parte um inteiro em linhas monoespaçadas para animação escalonada. */
export function chunkBigIntLine(
  label: string,
  value: bigint,
  maxChars = 28,
): string[] {
  const s = value.toString();
  if (s.length <= maxChars) {
    return [`${label}${s}`];
  }
  const lines: string[] = [`${label}${s.slice(0, maxChars)}`];
  for (let i = maxChars; i < s.length; i += maxChars) {
    lines.push(s.slice(i, i + maxChars));
  }
  return lines;
}
