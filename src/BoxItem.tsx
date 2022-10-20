import React from 'react';

interface PropsInterface {
    coordinate: string;
    isVisited: boolean;
    size: number;
    start: string;
    end: string;
    onVisited: (coordinate: string) => void;
}

function BoxItem(props: PropsInterface) {
    const { coordinate, isVisited, size, onVisited } = props;
    const isBlocker = coordinate.includes('w');
    const regularTile =
        isVisited || coordinate.includes('e') ? 'red' : 'orange';
    const isStartTile = coordinate.includes('s');
    const backgroundColor = isStartTile
        ? 'green'
        : isBlocker
        ? 'gray'
        : regularTile;
    const width = window.innerWidth;
    let maxWidth = 280;
    if (width > 440) {
        maxWidth = 400;
    }

    const itemSize = Math.floor(maxWidth / size);

    const style = {
        backgroundColor: backgroundColor,
        height: `${itemSize}px`,
        width: `${itemSize}px`,
    };

    function handleClick(): void {
        onVisited(coordinate);
    }

    return <div className="item" style={style} onClick={handleClick}></div>;
}

export default BoxItem;
