export function cn(
  ...inputs: (string | false | null | undefined | (string | false | null | undefined)[])[]
) {
  return inputs.flat().filter(Boolean).join(' ')
}
