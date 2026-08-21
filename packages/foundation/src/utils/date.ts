export function formatIfDateTime(value: string) {
  // Try parsing
  const date = new Date(value);

  // Invalid date
  if (isNaN(date.getTime())) {
    return value;
  }

  // Optional: ensure it looks like an ISO datetime first
  const isoRegex =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;

  if (!isoRegex.test(value)) {
    return value;
  }

  // Format nicely
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
}