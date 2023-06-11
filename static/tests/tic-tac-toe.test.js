import { findAllByText, fireEvent } from '@testing-library/dom'

import { JSDOM } from 'jsdom'
const fs = require('fs')
const Storage = require('dom-storage')

const html = fs.readFileSync('./pages/tic-tac-toe.html')
const dom = new JSDOM(html, {
  resources: 'usable',
  runScripts: 'dangerously',
})

global.document = dom.window.document
global.window = dom.window
global.localStorage = new Storage(null, { strict: true })
global.sessionStorage = new Storage(null, { strict: true })
global.swal = jest.fn()

describe('tic-tac-toe game test suite', () => {
  jest.useFakeTimers()
  jest
    .spyOn(window.HTMLMediaElement.prototype, 'play')
    .mockImplementation(() => {})

  function resetGrid() {
    for (let i = 0; i < document.getElementsByTagName('td').length; i++) {
      document.getElementsByTagName('td')[i].innerHTML = '&nbsp;'
    }
  }

  /**
   * checks if the cases with index values contained in the indexes array contains the symbols contained in the symbols array.
   * The rest of the grid will check if the symbols are empty
   * @param {int[]} indexes list of indexes
   * @param {int[]} symbols list of wanted symbols
   */
  function checkSymbols(indexes, symbols) {
    for (let i = 0; i < document.getElementsByTagName('td').length; i++) {
      if (!indexes.includes(i))
        expect(document.getElementsByTagName('td')[i].innerHTML).toBe('&nbsp;')
      else {
        expect(document.getElementsByTagName('td')[i].innerHTML).toBe(
          symbols[indexes.indexOf(i)]
        )
      }
    }
  }

  /**
   * Adds the symbols contained in symbols to the grid positions whose indexes are referenced in the indexes array
   * @param {int[]} indexes list of indexes
   * @param {int[]} symbols list of wanted symbols
   */
  function addSymbols(indexes, symbols) {
    for (let i = 0; i < indexes.length; i++) {
      document.getElementsByTagName('td')[indexes[i]].innerHTML = symbols[i]
    }
  }

  test('test game grid initialisation', async () => {
    jest.requireActual('../js/tic-tac-toe')
    await new Promise((resolve) => document.addEventListener('load', resolve))

    expect(document.getElementsByTagName('table')[0].children.length).toBe(3)
    expect(document.getElementsByTagName('td').length).toBe(9)
    let row = 0
    let col = 0
    for (let i = 0; i < 9; i++) {
      if (i > 0 && i % 3 === 0) {
        col = 0
        row += 1
      }
      let cName = `col${col} row${row}`
      if (i === 0 || i === 4 || i === 8) cName += ` diagonal0`
      if (i === 2 || i === 4 || i === 6) cName += ` diagonal1`
      expect(document.getElementsByTagName('td')[i].className).toBe(cName)
      col += 1
    }
  })

  test('test user input', () => {
    fireEvent.click(document.getElementsByTagName('td')[0])
    fireEvent.click(document.getElementsByTagName('td')[7])
    fireEvent.click(document.getElementsByTagName('td')[7])
    fireEvent.click(document.getElementsByTagName('td')[8])
    fireEvent.click(document.getElementsByTagName('td')[6])
    checkSymbols([0, 7, 8, 6], ['X', 'O', 'X', 'O'])
    expect((document.getElementById('turn').textContent = 'Player ' + 'X'))
  })

  test('test user0 win', () => {
    resetGrid()
    addSymbols([0, 1], ['X', 'X'])
    fireEvent.click(document.getElementsByTagName('td')[2])
    checkSymbols([], [])
  })

  test('test user1 win', () => {
    fireEvent.click(document.getElementsByTagName('td')[5])
    expect((document.getElementById('turn').textContent = 'Player ' + 'O'))
    addSymbols([0, 1], ['O', 'O'])
    fireEvent.click(document.getElementsByTagName('td')[2])
    checkSymbols([], [])
  })

  test('test draw', () => {
    fireEvent.click(document.getElementsByTagName('td')[0])
    fireEvent.click(document.getElementsByTagName('td')[1])
    fireEvent.click(document.getElementsByTagName('td')[2])
    fireEvent.click(document.getElementsByTagName('td')[4])
    fireEvent.click(document.getElementsByTagName('td')[3])
    fireEvent.click(document.getElementsByTagName('td')[5])
    fireEvent.click(document.getElementsByTagName('td')[8])
    fireEvent.click(document.getElementsByTagName('td')[6])

    expect((document.getElementById('turn').textContent = 'Player ' + 'X'))
    fireEvent.click(document.getElementsByTagName('td')[5])
    fireEvent.click(document.getElementsByTagName('td')[7])
    checkSymbols([], [])
    expect((document.getElementById('turn').textContent = 'Player ' + 'X'))
  })
})
