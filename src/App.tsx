import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import BoxItem from './BoxItem';
import { delay } from './helpers/delay';
import { generateGrid } from './helpers/generate-grid';
import { generateFunctionParameters } from './helpers/traversal-functions';

function App() {
    const [size, setSize] = useState<number>(20);
    const half = Math.floor(size / 2);

    const [start, setStart] = useState<string>(`${size / 2},${size / 2}`);
    const [isChoosingStart, setIsChoosingStart] = useState<boolean>(false);
    const [end, setEnd] = useState<string>('0,0');
    const [isChoosingEnd, setIsChoosingEnd] = useState<boolean>(false);
    const [grid, setGrid] = useState<string[][]>([]);
    const [visited, setVisited] = useState<Set<string>>(new Set());
    const delayRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        generateGrid(size, size, start, end, setGrid);
    }, [size, start, end]);

    useEffect(() => {
        setStart(`${half},${half}`);
        setEnd('0,0');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size]);

    function handleAddVisited(coordinate: string): void {
        setVisited((prev) => new Set(prev.add(coordinate)));
    }

    const isChoosingStartOrEnd = isChoosingStart || isChoosingEnd;

    function handleUserInput(coordinate: string): void {
        const [row, col] = coordinate
            .split(',')
            .map((string) => parseInt(string));
        const newArr = [...grid];

        let coord = newArr[row][col];

        let characterToDetect = 'w';

        if (coord.includes('s') || coord.includes('e')) {
            if (isChoosingStartOrEnd) {
                setIsChoosingEnd(false);
                setIsChoosingStart(false);
            }

            return;
        }

        if (isChoosingStart) {
            characterToDetect = 's';
        } else if (isChoosingEnd) {
            characterToDetect = 'e';
        }

        const rawCoordinate = `${row},${col}`;
        if (coord.includes(characterToDetect) && !isChoosingStartOrEnd) {
            newArr[row][col] = rawCoordinate;
        } else {
            const newCoordinate = `${rawCoordinate},${characterToDetect}`;
            newArr[row][col] = newCoordinate;

            if (isChoosingStart) {
                setStart(rawCoordinate);
            } else if (isChoosingEnd) {
                setEnd(rawCoordinate);
            }
        }

        setGrid(newArr);
        setIsChoosingStart(false);
        setIsChoosingEnd(false);
    }

    const renderGrid = grid.map((row, index) => (
        <div className="row" key={index}>
            {row.map((coordinate) => {
                const isVisited = visited.has(coordinate);

                return (
                    <BoxItem
                        coordinate={coordinate}
                        isVisited={isVisited}
                        key={coordinate}
                        size={size}
                        start={start}
                        end={end}
                        onVisited={handleUserInput}
                    />
                );
            })}
        </div>
    ));

    async function dfs(row: number, col: number): Promise<boolean> {
        const isColumnInbounds = col >= 0 && col < grid[row]?.length;
        const isRowInbounds = row >= 0 && row < grid.length;

        if (!isColumnInbounds || !isRowInbounds) return false;

        const current = grid[row][col];

        if (current.includes('w')) return false;

        if (visited.has(current)) return false;
        visited.add(current);
        handleAddVisited(current);

        if (current.includes('e')) return true;

        if (delayRef.current?.valueAsNumber) {
            const delayMS = Math.abs(100 - delayRef.current.valueAsNumber);

            if (delayMS) {
                await delay(delayMS);
            }
        }

        if (await dfs(row - 1, col)) return true;
        if (await dfs(row, col + 1)) return true;
        if (await dfs(row + 1, col)) return true;
        if (await dfs(row, col - 1)) return true;

        return false;
    }

    function generateShortestPath(coordinates: string[]) {
        const newArr = [...grid];
        coordinates.forEach((coordinate) => {
            const [row, col] = coordinate
                .split(',')
                .map((string) => parseInt(string));
            const newArr = [...grid];

            const rawCoordinate = `${row},${col}`;
            newArr[row][col] = `${rawCoordinate},s`;
        });

        setGrid(newArr);
    }

    async function bfs(row: number, col: number): Promise<void> {
        const q: [{ coordinate: string; past: string[] }] = [
            { coordinate: grid[row][col], past: [] },
        ];

        while (q.length > 0) {
            let current = q.shift();
            if (!current) return;

            let { coordinate, past } = current;

            if (!coordinate) return;

            if (coordinate.includes('w')) continue;

            const [row, col] = coordinate
                .split(',')
                .map((string) => parseInt(string));

            const rawCoordinate = `${row},${col}`;

            if (visited.has(coordinate)) continue;
            visited.add(coordinate);
            handleAddVisited(coordinate);

            if (coordinate.includes('e')) {
                past = [...past, rawCoordinate];
                generateShortestPath(past);

                return;
            }

            if (delayRef.current?.valueAsNumber) {
                const delayMS = Math.abs(100 - delayRef.current.valueAsNumber);

                if (delayMS) {
                    await delay(delayMS);
                }
            }

            // col

            if (col > 0) {
                q.push({
                    coordinate: grid[row][col - 1],
                    past: [...past, rawCoordinate],
                });
            }
            if (col < grid[row]?.length - 1) {
                q.push({
                    coordinate: grid[row][col + 1],
                    past: [...past, rawCoordinate],
                });
            }

            // row
            if (row > 0) {
                q.push({
                    coordinate: grid[row - 1][col],
                    past: [...past, rawCoordinate],
                });
            }
            if (row < grid.length - 1) {
                q.push({
                    coordinate: grid[row + 1][col],
                    past: [...past, rawCoordinate],
                });
            }
        }
    }

    function handleDFS(): void {
        const { row, col } = generateFunctionParameters(start);
        dfs(row, col);
    }

    function handleBFS(): void {
        const { row, col } = generateFunctionParameters(start);
        bfs(row, col);
    }

    async function handleReset(): Promise<void> {
        delayRef.current!.valueAsNumber = 100; // let the traversal finish

        await delay(50);
        setVisited(new Set());
        generateGrid(size, size, start, end, setGrid);

        delayRef.current!.valueAsNumber = 80;
    }

    function handleGridInput(e: React.ChangeEvent<HTMLSelectElement>): void {
        setGrid([]);
        setSize(parseInt(e.target.value));
    }

    const choosingText = isChoosingStart ? 'start' : 'end';

    return (
        <div className="App">
            <h1>Graph Traversal Visualizer</h1>
            <div className="flex">
                <button onClick={handleDFS}>DFS</button>
                <button onClick={handleBFS}>BFS</button>
                <button className="danger" onClick={handleReset}>
                    RESET
                </button>
            </div>

            <div className="grid">{renderGrid}</div>
            <div className="settings">
                <div className="inline-flex">
                    <p>GRID SIZE: </p>
                    <select onChange={handleGridInput} value={size}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                        <option value={40}>40</option>
                        <option value={50}>50</option>
                    </select>
                </div>
                <div
                    className="inline-flex"
                    style={{ marginTop: '-15px', marginBottom: '5px' }}
                >
                    <p>Speed: </p>
                    <input defaultValue={80} ref={delayRef} type="range" />
                </div>
                <p style={{ marginTop: 0 }}>
                    If not choosing the START / END tile, you can click the
                    tiles to create a barrier.
                </p>
                <div>
                    <button
                        className="start"
                        onClick={() => {
                            if (isChoosingEnd) {
                                setIsChoosingEnd(false);
                            }
                            setIsChoosingStart(true);
                        }}
                    >
                        Set Start Tile
                    </button>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <button
                        className="end"
                        onClick={() => {
                            if (isChoosingStart) {
                                setIsChoosingStart(false);
                            }
                            setIsChoosingEnd(true);
                        }}
                    >
                        Set End Tile
                    </button>
                </div>
                <div>
                    {isChoosingStartOrEnd && (
                        <p className="blink">Choosing {choosingText} Tile</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
