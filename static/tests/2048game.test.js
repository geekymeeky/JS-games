import { findAllByText, fireEvent } from '@testing-library/dom'

import { JSDOM } from 'jsdom'
const fs = require('fs')
const Storage = require('dom-storage')

const html = fs.readFileSync('./pages/2048game.html')
const dom = new JSDOM(html, {
  resources: 'usable',
  runScripts: 'dangerously',
})

global.document = dom.window.document
global.window = dom.window
global.localStorage = new Storage(null, { strict: true })
global.sessionStorage = new Storage(null, { strict: true })

describe('2048game test suite', () => {
  jest.useFakeTimers()
  /** changes the board as to get a specific state for testing
   * @param {number[]} squares array of index where squares should be initiated to 2
   */
  function initBoard(squares) {
    for (let i = 1; i < 17; i++) {
      if (!squares.includes(i))
        document.getElementById('grid').children[i].innerHTML = 0
      else {
        document.getElementById('grid').children[i].innerHTML = 2
      }
    }
  }

  /**
   * changes the value of a specific grid square to a specified value
   * @param {int} square index value of a grid square
   * @param {int} val value that should be added
   */
  function addBoard(square, val) {
    document.getElementById('grid').children[square].innerHTML = val
  }

  /**
   * checks that the board is in a specific state after an action has been invoked
   * @param {int[]} squares array of index where squares should have a value > 0
   * @param {int[]} vals array of values for the squares array parameter
   */
  function checkBoardState(squares, vals) {
    let additional2 = false
    for (let i = 1; i < 17; i++) {
      if (!squares.includes(i)) {
        if (
          document.getElementById('grid').children[i].innerHTML !== '0' &&
          !additional2
        ) {
          additional2 = true
        } else {
          if (document.getElementById('grid').children[i].innerHTML !== '0')
            expect(document.getElementById('grid').children[i].innerHTML).toBe(
              '0'
            )
        }
      } else {
        expect(document.getElementById('grid').children[i].innerHTML).toBe(
          vals[squares.indexOf(i)].toString()
        )
      }
    }
  }

  test('checks if board was created correctly with createBoard function', async () => {
    jest.requireActual('../js/2048game')
    await new Promise((resolve) => document.addEventListener('load', resolve))
    const squares2 = await findAllByText(document, 2)
    expect(document.getElementById('grid').children.length).toBe(17)
    expect(squares2.length).toBe(2)
  })

  test('checks up movement', async () => {
    initBoard([6, 10])
    checkBoardState([6, 10], [2, 2])

    fireEvent.keyUp(document, {
      key: 'w',
      keyCode: 87,
    })
    checkBoardState([2], [4])
    initBoard([])
    checkBoardState([], [])
    addBoard(2, 8)
    addBoard(14, 2)
    fireEvent.keyUp(document, {
      key: 'w',
      keyCode: 87,
    })
    checkBoardState([2, 6], [8, 2])

    initBoard([])
    checkBoardState([], [])
    addBoard(2, 128)
    addBoard(6, 128)
    addBoard(11, 16)
    addBoard(15, 16)
    fireEvent.keyUp(document, {
      key: 'w',
      keyCode: 87,
    })
    checkBoardState([2, 3], [256, 32])
  })

  test('checks down movement', async () => {
    initBoard([6, 10])
    checkBoardState([6, 10], [2, 2])

    fireEvent.keyUp(document, {
      key: 's',
      keyCode: 83,
    })
    checkBoardState([14], [4])
    initBoard([])
    checkBoardState([], [])
    addBoard(2, 8)
    addBoard(14, 2)
    fireEvent.keyUp(document, {
      key: 's',
      keyCode: 83,
    })
    checkBoardState([10, 14], [8, 2])

    initBoard([])
    checkBoardState([], [])
    addBoard(2, 128)
    addBoard(6, 128)
    addBoard(11, 16)
    addBoard(15, 16)
    fireEvent.keyUp(document, {
      key: 's',
      keyCode: 83,
    })
    checkBoardState([14, 15], [256, 32])
  })

  test('checks left movement', async () => {
    initBoard([6, 7])
    checkBoardState([6, 7], [2, 2])

    fireEvent.keyUp(document, { key: 'a', keyCode: 65 })
    //printBoard()
    checkBoardState([5], [4])

    initBoard([])
    addBoard(9, 8)
    addBoard(12, 2)
    fireEvent.keyUp(document, { key: 'a', keyCode: 65 })
    checkBoardState([9, 10], [8, 2])

    initBoard([])
    checkBoardState([], [])
    addBoard(1, 128)
    addBoard(3, 128)
    addBoard(6, 16)
    addBoard(8, 16)
    fireEvent.keyUp(document, { key: 'a', keyCode: 65 })
    checkBoardState([1, 5], [256, 32])
  })

  test('checks right movement', async () => {
    initBoard([6, 7])
    checkBoardState([6, 7], [2, 2])

    fireEvent.keyUp(document, { key: 'd', keyCode: 68 })
    //printBoard()
    checkBoardState([8], [4])

    initBoard([])
    addBoard(9, 8)
    addBoard(12, 2)
    fireEvent.keyUp(document, { key: 'd', keyCode: 68 })
    checkBoardState([11, 12], [8, 2])

    initBoard([])
    checkBoardState([], [])
    addBoard(1, 128)
    addBoard(3, 128)
    addBoard(6, 16)
    addBoard(8, 16)
    fireEvent.keyUp(document, { key: 'd', keyCode: 68 })
    checkBoardState([4, 8], [256, 32])
  })

  test('checks game loss ending', () => {
    initBoard([])
    let val = 2
    for (let i = 1; i < 17; i++) {
      if (i === 16) val = 0
      addBoard(i, val)
      if (i === 10) val = 2
      val = val * 2
    }

    //mocks alert because of an undefined error due to the mocking of window
    window.alert = jest.fn()
    fireEvent.keyUp(document, { key: 'd', keyCode: 68 })

    expect(document.getElementById('result').innerHTML).toBe('GAME OVER')
  })
})
