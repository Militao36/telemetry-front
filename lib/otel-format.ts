type OTelPrimitiveValue = string | number | boolean | null
export type FormattedOTelValue = OTelPrimitiveValue | FormattedOTelValue[] | { [key: string]: FormattedOTelValue }

type OTelAttribute = {
  key: string
  value: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isAttributeList(value: unknown[]): value is OTelAttribute[] {
  return value.every((item) => isRecord(item) && typeof item.key === "string" && "value" in item)
}

export function normalizeOTelValue(value: unknown): FormattedOTelValue {
  if (value === undefined || value === null) return null

  if (Array.isArray(value)) {
    if (isAttributeList(value)) {
      return value.reduce<Record<string, FormattedOTelValue>>((acc, item) => {
        acc[item.key] = normalizeOTelValue(item.value)
        return acc
      }, {})
    }

    return value.map((item) => normalizeOTelValue(item))
  }

  if (!isRecord(value)) {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value
    return String(value)
  }

  if ("stringValue" in value) return String(value.stringValue ?? "")
  if ("intValue" in value) return Number(value.intValue)
  if ("doubleValue" in value) return Number(value.doubleValue)
  if ("boolValue" in value) return Boolean(value.boolValue)
  if ("bytesValue" in value) return String(value.bytesValue ?? "")

  if (isRecord(value.arrayValue) && Array.isArray(value.arrayValue.values)) {
    return value.arrayValue.values.map((item) => normalizeOTelValue(item))
  }

  if (isRecord(value.kvlistValue) && Array.isArray(value.kvlistValue.values)) {
    return normalizeOTelValue(value.kvlistValue.values)
  }

  return Object.entries(value).reduce<Record<string, FormattedOTelValue>>((acc, [key, item]) => {
    acc[key] = normalizeOTelValue(item)
    return acc
  }, {})
}

export function formatOTelValue(value: unknown) {
  if (value === undefined || value === null || value === "") return "-"

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)
      return formatNormalizedValue(normalizeOTelValue(parsed))
    } catch {
      return value
    }
  }

  return formatNormalizedValue(normalizeOTelValue(value))
}

function formatNormalizedValue(value: FormattedOTelValue) {
  if (value === null || value === "") return "-"
  if (typeof value === "string") return value
  return JSON.stringify(value, null, 2)
}
