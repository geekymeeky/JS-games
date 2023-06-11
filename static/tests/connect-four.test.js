import { findAllByText, fireEvent } from '@testing-library/dom'

import { JSDOM } from 'jsdom'
const fs = require('fs')
const Storage = require('dom-storage')

const html = fs.readFileSync('./pages/connect-four-game.html')
const dom = new JSDOM(html, {
  resources: 'usable',
  runScripts: 'dangerously',
})

global.document = dom.window.document
global.window = dom.window
global.localStorage = new Storage(null, { strict: true })
global.sessionStorage = new Storage(null, { strict: true })
const msg = jest.fn()
global.swal = jest.fn(async () => {
  msg()
  fireEvent.click(document.getElementById('reset-btn'))
})

describe('connect-four test suite', () => {
  jest.useFakeTimers()
  jest
    .spyOn(window.HTMLMediaElement.prototype, 'play')
    .mockImplementation(() => {})
  window.clicksound = jest.fn(() => {})

  /**
   * checks if the cases with index values contained in the indexes array contains the values contained in the vals array.
   * The rest of the grid will check if the values are empty
   * @param {int[]} indexes list of indexes
   * @param {int[]} vals list of wanted values
   */
  function checkGrid(indexes, vals) {
    expect(document.getElementsByClassName('row').length).toBe(6)
    expect(document.getElementsByClassName('col').length).toBe(7 * 6)
    for (let i = 0; i < document.getElementsByClassName('col').length; i++) {
      if (!indexes.includes(i)) {
        expect(
          document.getElementsByClassName('col')[i].children[0].className
        ).toBe(`btn btn-${i + 1} grow`)
      } else {
        expect(
          document.getElementsByClassName('col')[i].children[0].className
        ).toBe(`btn btn-${i + 1} grow btn-player-${vals[indexes.indexOf(i)]}`)
        expect(
          document.getElementsByClassName('col')[i].children[0]
        ).toHaveProperty('disabled')
      }
    }
  }

  test('testing game init', async () => {
    jest.requireActual('../js/connect-four')
    await new Promise((resolve) => document.addEventListener('load', resolve))
    expect(document.getElementById('player-type').innerHTML).toBe('Player - 1')
    checkGrid([], [])
  })

  test('testing user inputs', () => {
    expect(document.getElementById('player-type').innerHTML).toBe('Player - 1')
    fireEvent.click(document.getElementsByClassName('col')[10].children[0])
    checkGrid([10], [1])
    expect(document.getElementById('player-type').innerHTML).toBe('Player - 2')

    fireEvent.click(document.getElementsByClassName('col')[18].children[0])
    checkGrid([10, 18], [1, 2])
    expect(document.getElementById('player-type').innerHTML).toBe('Player - 1')
    fireEvent.click(document.getElementsByClassName('col')[19].children[0])
    expect(document.getElementById('player-type').innerHTML).toBe('Player - 2')
  })

  test('testing board reset button', () => {
    fireEvent.click(document.getElementById('reset-btn'))
    checkGrid([], [])
    expect(document.getElementById('player-type').innerHTML).toBe('Player - 1')
  })

  test('testing player 1 win', async () => {
    //horizontal
    fireEvent.click(document.getElementsByClassName('col')[0].children[0])
    fireEvent.click(document.getElementsByClassName('col')[8].children[0])
    fireEvent.click(document.getElementsByClassName('col')[1].children[0])
    fireEvent.click(document.getElementsByClassName('col')[9].children[0])
    fireEvent.click(document.getElementsByClassName('col')[2].children[0])
    fireEvent.click(document.getElementsByClassName('col')[10].children[0])
    fireEvent.click(document.getElementsByClassName('col')[3].children[0])
    checkGrid([], [])
    expect(msg).toHaveBeenCalledTimes(1)

    //vertical
    fireEvent.click(document.getElementsByClassName('col')[0].children[0])
    fireEvent.click(document.getElementsByClassName('col')[8].children[0])
    fireEvent.click(document.getElementsByClassName('col')[7].children[0])
    fireEvent.click(document.getElementsByClassName('col')[9].children[0])
    fireEvent.click(document.getElementsByClassName('col')[14].children[0])
    fireEvent.click(document.getElementsByClassName('col')[10].children[0])
    fireEvent.click(document.getElementsByClassName('col')[21].children[0])
    checkGrid([], [])
    expect(msg).toHaveBeenCalledTimes(2)

    //diagonal1
    fireEvent.click(document.getElementsByClassName('col')[0].children[0])
    fireEvent.click(document.getElementsByClassName('col')[1].children[0])
    fireEvent.click(document.getElementsByClassName('col')[8].children[0])
    fireEvent.click(document.getElementsByClassName('col')[2].children[0])
    fireEvent.click(document.getElementsByClassName('col')[16].children[0])
    fireEvent.click(document.getElementsByClassName('col')[3].children[0])
    fireEvent.click(document.getElementsByClassName('col')[24].children[0])
    checkGrid([], [])
    expect(msg).toHaveBeenCalledTimes(3)

    //diagonal0
    fireEvent.click(document.getElementsByClassName('col')[6].children[0])
    fireEvent.click(document.getElementsByClassName('col')[1].children[0])
    fireEvent.click(document.getElementsByClassName('col')[12].children[0])
    fireEvent.click(document.getElementsByClassName('col')[2].children[0])
    fireEvent.click(document.getElementsByClassName('col')[18].children[0])
    fireEvent.click(document.getElementsByClassName('col')[3].children[0])
    fireEvent.click(document.getElementsByClassName('col')[24].children[0])
    checkGrid([], [])
    expect(msg).toHaveBeenCalledTimes(4)
  })

  test('testing player 2 win', async () => {
    //horizontal
    fireEvent.click(document.getElementsByClassName('col')[8].children[0])
    fireEvent.click(document.getElementsByClassName('col')[0].children[0])
    fireEvent.click(document.getElementsByClassName('col')[9].children[0])
    fireEvent.click(document.getElementsByClassName('col')[1].children[0])
    fireEvent.click(document.getElementsByClassName('col')[10].children[0])
    fireEvent.click(document.getElementsByClassName('col')[2].children[0])
    fireEvent.click(document.getElementsByClassName('col')[40].children[0])
    fireEvent.click(document.getElementsByClassName('col')[3].children[0])
    checkGrid([], [])
    expect(msg).toHaveBeenCalledTimes(1)

    //vertical
    fireEvent.click(document.getElementsByClassName('col')[8].children[0])
    fireEvent.click(document.getElementsByClassName('col')[0].children[0])
    fireEvent.click(document.getElementsByClassName('col')[9].children[0])
    fireEvent.click(document.getElementsByClassName('col')[7].children[0])
    fireEvent.click(document.getElementsByClassName('col')[10].children[0])
    fireEvent.click(document.getElementsByClassName('col')[14].children[0])
    fireEvent.click(document.getElementsByClassName('col')[40].children[0])
    fireEvent.click(document.getElementsByClassName('col')[21].children[0])
    checkGrid([], [])
    expect(msg).toHaveBeenCalledTimes(2)

    //diagonal1
    fireEvent.click(document.getElementsByClassName('col')[1].children[0])
    fireEvent.click(document.getElementsByClassName('col')[0].children[0])
    fireEvent.click(document.getElementsByClassName('col')[2].children[0])
    fireEvent.click(document.getElementsByClassName('col')[8].children[0])
    fireEvent.click(document.getElementsByClassName('col')[3].children[0])
    fireEvent.click(document.getElementsByClassName('col')[16].children[0])
    fireEvent.click(document.getElementsByClassName('col')[40].children[0])
    fireEvent.click(document.getElementsByClassName('col')[24].children[0])
    checkGrid([], [])
    expect(msg).toHaveBeenCalledTimes(3)

    //diagonal0
    fireEvent.click(document.getElementsByClassName('col')[1].children[0])
    fireEvent.click(document.getElementsByClassName('col')[6].children[0])
    fireEvent.click(document.getElementsByClassName('col')[2].children[0])
    fireEvent.click(document.getElementsByClassName('col')[12].children[0])
    fireEvent.click(document.getElementsByClassName('col')[3].children[0])
    fireEvent.click(document.getElementsByClassName('col')[18].children[0])
    fireEvent.click(document.getElementsByClassName('col')[40].children[0])
    fireEvent.click(document.getElementsByClassName('col')[24].children[0])
    checkGrid([], [])
    expect(msg).toHaveBeenCalledTimes(4)
  })

  test('testing draw', () => {
    for (let i = 0; i < 21; i++) {
      fireEvent.click(document.getElementsByClassName('col')[i].children[0])
    }
    fireEvent.click(document.getElementsByClassName('col')[22].children[0])
    fireEvent.click(document.getElementsByClassName('col')[21].children[0])
    fireEvent.click(document.getElementsByClassName('col')[24].children[0])
    fireEvent.click(document.getElementsByClassName('col')[23].children[0])
    fireEvent.click(document.getElementsByClassName('col')[26].children[0])
    fireEvent.click(document.getElementsByClassName('col')[25].children[0])

    fireEvent.click(document.getElementsByClassName('col')[29].children[0])
    fireEvent.click(document.getElementsByClassName('col')[27].children[0])
    fireEvent.click(document.getElementsByClassName('col')[31].children[0])
    fireEvent.click(document.getElementsByClassName('col')[28].children[0])
    fireEvent.click(document.getElementsByClassName('col')[33].children[0])
    fireEvent.click(document.getElementsByClassName('col')[30].children[0])
    fireEvent.click(document.getElementsByClassName('col')[41].children[0])
    fireEvent.click(document.getElementsByClassName('col')[32].children[0])
    fireEvent.click(document.getElementsByClassName('col')[39].children[0])
    fireEvent.click(document.getElementsByClassName('col')[40].children[0])
    fireEvent.click(document.getElementsByClassName('col')[37].children[0])
    fireEvent.click(document.getElementsByClassName('col')[38].children[0])
    fireEvent.click(document.getElementsByClassName('col')[35].children[0])
    fireEvent.click(document.getElementsByClassName('col')[36].children[0])
    fireEvent.click(document.getElementsByClassName('col')[34].children[0])
    checkGrid([], [])
    expect(msg).toHaveBeenCalledTimes(1)
  })
})
