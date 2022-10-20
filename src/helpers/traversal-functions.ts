export function generateFunctionParameters(start: string): {
    row: number;
    col: number;
} {
    const [row, col] = start.split(',').map((string) => parseInt(string));

    return {
        row,
        col,
    };
}
