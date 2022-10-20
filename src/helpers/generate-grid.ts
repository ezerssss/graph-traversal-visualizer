export function generateGrid(
    columnLimit: number,
    rowLimit: number,
    start: string,
    end: string,
    setGrid: React.Dispatch<React.SetStateAction<string[][]>>,
): void {
    const arr = [];
    for (let i = 0; i < rowLimit; i += 1) {
        const row: string[] = [];
        for (let j = 0; j < columnLimit; j += 1) {
            let coordinate = `${i},${j}`;
            if (coordinate === start) {
                coordinate += ',s';
            }
            if (coordinate === end) {
                coordinate += ',e';
            }

            row.push(coordinate);
        }
        arr.push(row);
    }
    setGrid(arr);
}
