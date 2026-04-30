/** Classes da grid de projetos: poucos itens centralizam e limitam largura (evita card minúsculo à esquerda). */
export function projectGridClassName(count: number): string {
  if (count <= 0) return "grid w-full grid-cols-1 gap-6";
  if (count === 1) {
    return "grid w-full grid-cols-1 justify-items-stretch gap-6 sm:mx-auto sm:max-w-2xl";
  }
  if (count === 2) {
    return "grid w-full grid-cols-1 gap-6 md:mx-auto md:max-w-4xl md:grid-cols-2";
  }
  return "grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3";
}
