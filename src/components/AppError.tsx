export const AppError = (props: {
  error: unknown
  resetErrorBoundary: (...args: unknown[]) => void
}) => {
  const msg =
    props.error instanceof Error ? props.error.message : String(props.error)
  return (
    <div className="p-10" role="alert">
      <div className="text-lg font-bold text-destructive">
        <div className="animate-pulse">{msg}</div>
      </div>
      <button type="button" onClick={props.resetErrorBoundary}>
        Retry
      </button>
    </div>
  )
}
