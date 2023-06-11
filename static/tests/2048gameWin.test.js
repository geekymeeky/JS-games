import { fireEvent } from '@testing-library/dom'

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

describe('my test suite', () => {
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

  function printBoard() {
    let row = []
    for (let i = 0; i < 16; i++) {
      row.push(document.getElementById('grid').children[i + 1].innerHTML)
      if ((i + 1) % 4 === 0) {
        console.log('---\n' + row + '\n---')
        row = []
      }
    }
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
            console.log(
              'error at ' +
                i +
                ' => ' +
                document.getElementById('grid').children[i].innerHTML
            )
          expect(document.getElementById('grid').children[i].innerHTML).toBe(
            '0'
          )
        }
      } else {
        /*console.log(
            'square ' +
              i +
              ' => ' +
              document.getElementById('grid').children[i].innerHTML
          )*/

        expect(document.getElementById('grid').children[i].innerHTML).toBe(
          vals[squares.indexOf(i)].toString()
        )
      }
    }
  }
  test('checks game win ending', async () => {
    jest.requireActual('../js/2048game')
    await new Promise((resolve) => document.addEventListener('load', resolve))
    initBoard([])
    addBoard(5, 1024)
    addBoard(6, 1024)

    //mocks alert because of an undefined error due to the mocking of window
    jest.spyOn(window, 'alert').mockImplementation(() => {})
    fireEvent.keyUp(document, { key: 'd', keyCode: 68 })
    checkBoardState([8], [2048])

    expect(document.getElementById('result').innerHTML).toBe('YOU WON!')
  })
})
