export const paramsToLocation = (urlSearchParams: URLSearchParams) => {
  const params = urlSearchParams.toString()
  if (!params) return ''
  return `?${params}`
}
