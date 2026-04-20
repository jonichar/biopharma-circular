export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-CO").format(num);
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function getRiskColor(level: string): string {
  switch (level) {
    case "bajo":
      return "var(--color-primary)";
    case "medio":
      return "var(--color-accent)";
    case "alto":
      return "var(--color-danger)";
    case "critico":
      return "#DC2626";
    default:
      return "var(--text-secondary)";
  }
}
