import { useEffect, useState } from "react";
import { randomInt, useInterval } from "../lib/utils.js";
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

const PLATFORM_SIZE = 10; //BOARD_SIZE

const Direction = {
  UP: "UP",
  RIGHT: "RIGHT",
  DOWN: " DOWN",
  LEFT: "LEFT",
};

const getStartingSnakeLinkedListValue = (platform) => {
  const rowSize = platform.length;
  const colSize = platform[0].length;
  const startingRow = Math.round(rowSize / 3);
  const startingCol = Math.round(colSize / 3);
  const startingCell = platform[startingRow][startingCol];
  return {
    row: startingRow,
    col: startingCol,
    cell: startingCell,
  };
};

export default function Platform() {
  const [score, setScore] = useState(0);
  //Board
  const [gameOn, setGameOn] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [platform, setPlatform] = useState(createPlatform(PLATFORM_SIZE)); //board
  const [snake, setSnake] = useState(
    new LinkedList(getStartingSnakeLinkedListValue(platform))
  );
  const [snCells, setSnCells] = useState(new Set([snake.head.value.cell])); // snakeCells

  const [direction, setDirection] = useState(Direction.RIGHT);
  const [foodCell, setFoodCell] = useState(snake.head.value.cell + 5);

  const startHandler = () => {
    setGameOver(false);
    setScore(0);
    setGameOn(true);
  };

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      handleKeydown(e);
    });
  }, []);

  useInterval(() => {
    if (gameOn) {
      moveSnake();
    }
  }, 500);

  const handleKeydown = (e) => {
    const newDirection = getDirectionFromKey(e.key);
    const isValidDirection = newDirection !== "";
    if (!isValidDirection) return;
    const snWillRunIntoItself =
      getOppositeDirection(newDirection) === direction && snCells.size > 1;
    if (snWillRunIntoItself) return;
    setDirection(newDirection);
  };

  const moveSnake = () => {
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
    if (isOutOfBorders(nextHeadPosition, platform)) {
      handleGameOver();
      setGameOn(false);
      setGameOver(true);
      return;
    }
    const nextHeadCell = platform[nextHeadPosition.row][nextHeadPosition.col];
    if (snCells.has(nextHeadCell)) {
      handleGameOver();
      setGameOn(false);
      setGameOver(true);
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
    newSnCells.delete(snake.tail.value.cell);
    newSnCells.add(nextHeadCell);

    snake.tail = snake.tail.next;
    if (snake.tail === null) snake.tail = snake.head;

    const foodConsumed = nextHeadCell === foodCell;
    if (foodConsumed) {
      growSnake(newSnCells);
      handleFoodConsumption(newSnCells);
    }

    setSnCells(newSnCells);
  };
  const growSnake = (newSnCells) => {
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

    newSnCells.add(newTailCell);
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
    setScore(score + 1);
  };

  const handleGameOver = () => {
    const snakeLinkedListStartingValue =
      getStartingSnakeLinkedListValue(platform);
    setSnake(new LinkedList(snakeLinkedListStartingValue));
    setFoodCell(snakeLinkedListStartingValue.cell + 5);
    setSnCells(new Set([snakeLinkedListStartingValue.cell]));
    setDirection(Direction.RIGHT);
  };

  return (
    <>
      <h1>Snake game</h1>
      {!gameOver ? (
        <h2>Score: {score}</h2>
      ) : (
        <h2>Game is over! Congratulations, your score is {score}!</h2>
      )}
      <button
        className={gameOn ? "gameOnClass" : "startClass"}
        onClick={startHandler}
      >
        Start game
      </button>

      <div className="platform">
        {platform.map((row, rowIdx) => (
          <div key={rowIdx} className="row">
            {row.map((cellValue, cellIdx) => {
              const className = getCellClassName(cellValue, foodCell, snCells);
              return <div key={cellIdx} className={className}></div>;
            })}
          </div>
        ))}
      </div>
    </>
  );
}
// end of Platform

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

const getCellClassName = (cellValue, foodCell, snakeCells) => {
  let className = "cell";
  if (cellValue === foodCell) {
    className = "cell food-cell";
  }
  if (snakeCells.has(cellValue)) className = "cell snake-cell";
  return className;
};
