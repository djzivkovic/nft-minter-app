export function truncateString(str: string, firstCharCount = str.length, endCharCount = 0) {
    if (str.length <= firstCharCount + endCharCount) {
        return str;
    }

    const firstPortion = str.slice(0, firstCharCount);
    const endPortion = str.slice(-endCharCount);
    const dots = "...";

    return `${firstPortion}${dots}${endPortion}`;
}
