export function toDateTimeLocalValue(isoValue: string): string {
  const date = new Date(isoValue);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export function fromDateTimeLocalValue(value: string): string {
  if (!value) return new Date().toISOString();
  return new Date(value).toISOString();
}

export function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
