import { LotteryTicket } from 'config/constants/types'

export const encodeNumbers = (value: any) => {
  const res = Array.from({ length: 5 }, (_, j) => 0)
  for (let i = 0; i < value.length; i++) {
    res[i] = value[i]
  }
  return `1${res.join('')}`
}

export const encodeAlphabet = (value: any, ticketSize: any) => {
  const processed = []
  // const value = val?.toLowerCase()
  const ALPHABET = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
    i: 8,
    j: 9,
    k: 10,
    l: 11,
    m: 12,
    n: 13,
    o: 14,
    p: 15,
    q: 16,
    r: 17,
    s: 18,
    t: 19,
    u: 20,
    v: 21,
    w: 22,
    x: 23,
    y: 24,
    z: 25,
    ' ': 26,
    0: 27,
    1: 28,
    2: 29,
    3: 30,
    4: 31,
    5: 32,
    6: 33,
    7: 34,
    8: 35,
    9: 36,
  }
  const res = Array.from({ length: ticketSize }, (_, j) => 0)
  let k = 1
  for (let i = 0; i < value.length; i++) {
    if (!processed.includes(value[i])) {
      if (ALPHABET[value[i]] !== undefined) {
        processed.push(value[i])
        const pos = ALPHABET[value[i]]
        res[pos] = k++
      } else {
        res[i] = value[i]
      }
    }
  }
  return `1${res.join('')}`
}

export const decodeAlphabet = (value: any, ticketSize: any) => {
  const ALPHABET = {
    0: 'a',
    1: 'b',
    2: 'c',
    3: 'd',
    4: 'e',
    5: 'f',
    6: 'g',
    7: 'h',
    8: 'i',
    9: 'j',
    10: 'k',
    11: 'l',
    12: 'm',
    13: 'n',
    14: 'o',
    15: 'p',
    16: 'q',
    17: 'r',
    18: 's',
    19: 't',
    20: 'u',
    21: 'v',
    22: 'w',
    23: 'x',
    24: 'y',
    25: 'z',
    26: '',
    27: '0',
    28: '1',
    29: '2',
    30: '3',
    31: '4',
    32: '5',
    33: '6',
    34: '7',
    35: '8',
    36: '9',
  }
  const res = Array.from({ length: ticketSize }, (_, j) => 0)
  for (let i = 1; i < value.length; i++) {
    if (value[i] !== 0) {
      const pos = ALPHABET[i - 1]
      res[value[i]] = pos
    }
  }
  return res.join('').replaceAll('0', '').trim()
}

/**
 * Generate a specific number of unique, randomised 7-digit lottery numbers between 1000000 & 1999999
 */
const generateTicketNumbers = (
  userCurrentTickets?: LotteryTicket[],
  alphabet = false,
  minNumber = 1000000,
  maxNumber = 1999999,
) => {
  // 1000020005000100000300000000
  // 1000020005000100000300000000
  // 1000020005000100000300000000
  // console.log("2encodeAlphabet==================>", encodeAlphabet("messi"), encodeNumbers("24"), encodeNumbers("4"))
  // Populate array with existing tickets (if they have them) to ensure no duplicates when generating new numbers
  const existingTicketNumbers =
    userCurrentTickets?.length > 0
      ? userCurrentTickets.map((ticket) => {
          if (ticket?.number) {
            return ticket?.number
          }
          return ''
        })
      : []
  const generatedTicketNumbers = [...existingTicketNumbers]

  console.log('2randomNumber===============>', generatedTicketNumbers)
  return generatedTicketNumbers
}

export default generateTicketNumbers
