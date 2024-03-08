export async function parseJson<T>(response: Response) {
  if (!response.ok) throw new Error('Failed to fetch data')
  return (await response.json()) as Awaited<T>
}
