interface Props {
  error: string
  onRetry?: () => void
}

export const ErrorMessage = ({ error, onRetry }: Props) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <span className="block sm:inline">{error}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-4 text-sm underline hover:text-red-800"
        >
          Try again
        </button>
      )}
    </div>
  )
} 