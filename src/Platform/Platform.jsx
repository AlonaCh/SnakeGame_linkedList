import React, { useEffect, useState } from 'react';
import './Platform.css';

class LinkedListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class SinglyLinkedList {
    constructor(value) {
        const node = new LinkedListNode(value);
        this.head = node;
        this.tail = node;
    }
}
const PLATFORM_SIZE = 10; //BOARD_SIZE

export default function Platform() { //Board
    const [platform, setPlatform] = useState( //board
        createPlatform(PLATFORM_SIZE));
    const [cells, setCells] = useState(new Set([44])); // snakeCells
    const [snake, setSnake] = useState(new LinkedList(new Cell(4, 3, 44))); // snake will start at 44
    const [direction, setDirection] = useState(Direction.RIGHT);
    const cellsRef = useRef(); // snakeCellsRef
    cellsRef.current = new Set([44]);

    useEffect(() => {
        setInterval(() => {
            moveSnake();
        }, 1000);
    }, []);


    function moveSnake() {
        const currentHeadPosition = { // currentHeadCoords
            row: snake.head.value.row,
            col: snake.head.value.col,
        };

        //nextHeadCoords
        const nextHeadPosition = getNextHeadPosition(currentHeadPosition, direction);
        const nextHeadValue = platform[nextHeadPosition.row][nextHeadPosition.col];
        const newHead = new LinkedListNode(
            new Cell(nextHeadPosition.row, nextHeadPosition.col, nextHeadValue),
        );

        const newCells = new Set(cellsRef.current);
        console.log(cellsRef.current)
        newCells.delete(snake.tail.value.value);
        newCells.add(nextHeadValue);
    }
    snake.head = newHead;
    snake.tail = snake.tail.next;
    if (snake.tail === null) snake.tail = snake.head;

    cellsRef.current = newCells;
    setCells(newCells)
}
const getNextHeadPosition = (currentHeadPosition, direction) => {

} // Alona finished here!! 15:55
return (
    <>

        <div className='platform'>
            {platform.map((row, rowIdx) => (
                <div key={rowIdx} className='row'>{
                    row.map((cellValue, cellIdx) => (
                        <div key={cellIdx} className={`cell ${cells.has(cellValue) ? 'snake-cell' : ''}`}></div>
                    ))
                }</div>
            ))}
        </div>
    </>
);


const createPlatform = PLATFORM_SIZE => {
    let counter = 1; // every cell in the platform has a unic number from 1
    const platform = [];
    for (let row = 0; row < PLATFORM_SIZE; row++) {
        const currentRow = [];
        for (let col = 0; col < PLATFORM_SIZE; col++) {
            currentRow.push(counter++);
        }
        platform.push(currentRow);
    }
    return platform;
};
