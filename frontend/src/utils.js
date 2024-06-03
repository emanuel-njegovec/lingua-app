export function formatDate(datetime) {
    const date = new Date(datetime);
    const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
    const localDate = new Date(date.getTime() - timezoneOffset);
    return localDate.toLocaleString('en-GB');
}