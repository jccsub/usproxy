
export function isJsonValue(value ) {
  try {

    if (value && typeof value === 'object' && value !== null) {
        return true;
    }
    var obj = JSON.parse(value)
    if (obj && typeof obj === 'object' && obj !== null) {
      return true
    }
  } catch (err) {}
  return false
}
