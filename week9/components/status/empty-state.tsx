interface EmptyStateProps {
  message: string;
}

function EmptyState({ message }: EmptyStateProps) {
  return <p className="py-24 text-center text-ink-2">{message}</p>;
}

export default EmptyState;
