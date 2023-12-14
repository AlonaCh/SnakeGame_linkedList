import { useEffect, useRef, useState } from "react";
import "./Platform.css";

class LinkedListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor(value) {
    const node = new LinkedListNode(value);
    this.head = node;
    this.tail = node;
  }
}
class Cell {
  constructor(row, col, value) {
    this.row = row;
    this.col = col;
    this.value = value;
  }
}

const PLATFORM_SIZE = 10; //BOARD_SIZE

const Direction = {
  UP: "UP",
  RIGHT: "RIGHT",
  DOWN: " DOWN",
  LEFT: "LEFT",
};

export default function Platform() {
  const [score, setScore] = useState(0);
  //Board
  const [platform, setPlatform] = useState(createPlatform(PLATFORM_SIZE)); //board
  const [snCells, setSnCells] = useState(new Set([44])); // snakeCells
  const [snake, setSnake] = useState(new LinkedList(new Cell(4, 3, 44))); // snake will start at 44
  const [direction, setDirection] = useState(Direction.RIGHT);
  const [foodCell, setFoodCell] = useState(48);
  const [foodShouldReverseDirection, setFoodShouldReverseDirection] =
    useState(false);

  useEffect(() => {
    setInterval(() => {
      moveSnake();
    }, 1000);
    window.addEventListener("keydown", (e) => {
      const newDirection = getDirectionFromKey(e.key);
      const isValidDirection = newDirection !== "";
      if (isValidDirection) setDirection(newDirection);
    });
  }, []);

  function moveSnake() {
    const currentHeadPosition = {
      // currentHeadCoords
      row: snake.head.value.row,
      col: snake.head.value.col,
    };

    //nextHeadCoords
    const nextHeadPosition = getPositionInDirection(
      currentHeadPosition,
      direction
    );
    if (isOutOfBorders(nextHeadPosition, board)) {
      handleGameOver();
      return;
    }
    const nextHeadCell = platform[nextHeadPosition.row][nextHeadPosition.col];
    if (snCells.has(nextHeadCell)) {
      handleGameOver();
      return;
    }

    const newHead = new LinkedListNode({
      row: nextHeadPosition.row,
      col: nextHeadPosition.col,
      cell: nextHeadCell,
    });
    const currentHead = snake.head;
    snake.head = newHead;
    currentHead.next = newHead;

    const newSnCells = new Set(snCells);
    newSnCells.delete(snake.tail.value.value);
    newSnCells.add(nextHeadCell);

    snake.tail = snake.tail.next;
    if (snake.tail === null) snake.tail = snake.head;

    const foodConsumed = nextHeadCell === foodCell;
    if (foodConsumed) {
      growSnake(newSnCells);
      if (foodShouldReverseDirection) reverseSn();
      handleFoodConsumption(newSnCells);
    }

    /*  cellsRef.current = newCells; */
    setSnCells(newSnCells);
  }
  const growSnake = () => {
    const growthNodePosition = getGrowthNodePosition(snake.tail, direction);
    if (isOutOfBorders(growthNodePosition, platform)) {
      return;
    }
    const newTailCell =
      platform[growthNodePosition.row][growthNodePosition.col];
    const newTail = new LinkedListNode({
      row: growthNodePosition.row,
      col: growthNodePosition.col,
      cell: newTailCell,
    });
    const currentTail = snake.tail;
    snake.tail = newTail;
    snake.tail.next = currentTail;

    const newSnCells = new Set(snCells);
    newSnCells.add(newTailCell);

    setSnCells(newSnCells);
  };

  const getNextHeadPosition = (currentHeadPosition, direction) => {
    if (direction === Direction.UP) {
      return {
        row: currentHeadPosition.row - 1,
        col: currentHeadPosition.col,
      };
    }
    if (direction === Direction.RIGHT) {
      return {
        row: currentHeadPosition.row,
        col: currentHeadPosition.col + 1,
      };
    }
    if (direction === Direction.DOWN) {
      return {
        row: currentHeadPosition.row + 1,
        col: currentHeadPosition.col,
      };
    }
    if (direction === Direction.LEFT) {
      return {
        row: currentHeadPosition.row,
        col: currentHeadPosition.col - 1,
      };
    }
  };
  const handleFoodConsumption = () => {
    const maxPossibleCellValue = PLATFORM_SIZE * PLATFORM_SIZE;
    let nextFoodCell;
    while (true) {
      nextFoodCell = randomInt(1, maxPossibleCellValue);
      if (snCells.has(nextFoodCell) || foodCell === nextFoodCell) continue;
      break;
    }
    setFoodCell(nextFoodCell);
  };

  return (
    <>
      <h1>Score: {score}</h1>
      <button onClick={() => moveSnake()}>Move Manually</button>
      <button onClick={() => growSnake()}>Grow Snake Manually</button>
      <div className="platform">
        {platform.map((row, rowIdx) => (
          <div key={rowIdx} className="row">
            {row.map((cellValue, cellIdx) => (
              <div
                key={cellIdx}
                className={`cell ${snCells.has(cellValue) ? "snake-cell" : ""}
                ${foodCell === cellValue ? "food-cell" : ""}`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
} // end of Platform

//functions used above

const createPlatform = (PLATFORM_SIZE) => {
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
const getPositionInDirection = (position, direction) => {
  if (direction === Direction.UP) {
    return {
      row: position.row - 1,
      col: position.col,
    };
  }
  if (direction === Direction.RIGHT) {
    return {
      row: position.row,
      col: position.col + 1,
    };
  }
  if (direction === Direction.DOWN) {
    return {
      row: position.row + 1,
      col: position.col,
    };
  }
  if (direction === Direction.LEFT) {
    return {
      row: position.row,
      col: position.col - 1,
    };
  }
};

//his ifOutOfBounds
const isOutOfBorders = (directions, platform) => {
  const { row, col } = directions;
  if (row < 0 || col < 0) return true;
  if (row >= platform.length || col >= platform[0].length) return true;
  return false;
};

const getDirectionFromKey = (key) => {
  if (key === "ArrowUp") return Direction.UP;
  if (key === "ArrowRight") return Direction.RIGHT;
  if (key === "ArrowDown") return Direction.DOWN;
  if (key === "ArrowLeft") return Direction.LEFT;
  return "";
};
const getNextNodeDirection = (node, currentDirection) => {
  if (node.next === null) return currentDirection;
  const { row: currentRow, col: currentCol } = node.value;
  const { row: nextRow, col: nextCol } = node.next.value;
  if (nextRow === currentRow && nextCol === currentCol + 1) {
    return Direction.RIGHT;
  }
  if (nextRow === currentRow && nextCol === currentCol - 1) {
    return Direction.LEFT;
  }
  if (nextCol === currentCol && nextRow === currentRow + 1) {
    return Direction.DOWN;
  }
  if (nextCol === currentCol && nextRow === currentRow - 1) {
    return Direction.UP;
  }
  return "";
};

const getGrowthNodePosition = (snTail, currentDirection) => {
  const tailNextNodeDirection = getNextNodeDirection(snTail, currentDirection);
  const growthDirection = getOppositeDirection(tailNextNodeDirection);
  const currentTailPosition = {
    row: snTail.value.row,
    col: snTail.value.col,
  };
  const growthNodePosition = getPositionInDirection(
    currentTailPosition,
    growthDirection
  );
  return growthNodePosition;
};

const getOppositeDirection = (direction) => {
  if (direction === Direction.UP) return Direction.DOWN;
  if (direction === Direction.RIGHT) return Direction.LEFT;
  if (direction === Direction.DOWN) return Direction.UP;
  if (direction === Direction.LEFT) return Direction.RIGHT;
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
