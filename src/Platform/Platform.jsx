import React, { useState } from 'react';
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


    return (
        //className='platform' , was board
        <div className='platform'>
            {platform.map((row, rowIdx) => (
                <div key={rowIdx} className='row'>{
                    row.map((cell, cellIdx) => (
                        <div key={cellIdx} className={`cell ${true ? 'snake-cell' : ''}`}></div>
                    ))
                }</div>
            ))}
        </div>
    );
};

const createPlatform = PLATFORM_SIZE => {
    let counter = 1;
    const platform = [];
    for (let row = 0; row < 10; row++) {
        const currentRow = [];
        for (let col = 0; col < 10; col++) {
            currentRow.push(counter++);
        }
        platform.push(currentRow);
    }
    return platform;
};