export function toIsoStringInLocalTZ(date: Date) {

    const offset = date.getTimezoneOffset();
    const newDate = new Date(date.getTime() - offset * 60 * 1000);
    return newDate.toISOString().slice(0, 16);
  }