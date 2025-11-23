export function getLogZoom (step: number, maxSteps: number, minZoom: number, maxZoom: number): number {
  const logMinZoom = Math.log(minZoom < 0 ? 1 / Math.abs(minZoom) : minZoom)
  const logMaxZoom = Math.log(maxZoom)
  const logZoom = logMinZoom + (logMaxZoom - logMinZoom) * (step / (maxSteps - 1))
  return Math.exp(logZoom)
}
