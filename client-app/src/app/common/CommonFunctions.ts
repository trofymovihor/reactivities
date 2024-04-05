export function truncate(str: string | undefined, length: number) {
    if (str) {
        return str.length > length ? str.substring(0, length-3) + '...' : str;
    }
}