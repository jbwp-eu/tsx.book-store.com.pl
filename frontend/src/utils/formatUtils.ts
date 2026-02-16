export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

export function formateDate(date: Date) {
  return new Date(date).toLocaleString();
}

const CURRENCY = import.meta.env.VITE_CURRENCY;

let currency;

if (CURRENCY === "pln") {
  currency = "PLN";
} else if (CURRENCY === "us") {
  currency = "USD";
}

const CURRENCY_FORMATTER = new Intl.NumberFormat(CURRENCY, {
  currency,
  style: "currency",
  minimumFractionDigits: 2,
});

const INTEGER_CURRENCY_FORMATTER = new Intl.NumberFormat(CURRENCY, {
  currency,
  style: "currency",
  minimumFractionDigits: 0,
});

// Format currency using the formatter above

export function formatCurrency(amount: number | string | null) {
  if (typeof amount === "number") {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === "string") {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else return CURRENCY_FORMATTER.format(Number(amount));
}

export function integerFormatCurrency(amount: number | string | null) {
  if (typeof amount === "number") {
    return INTEGER_CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === "string") {
    return INTEGER_CURRENCY_FORMATTER.format(Number(amount));
  } else return "NaN";
}
