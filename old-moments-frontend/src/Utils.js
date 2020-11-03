// Year: ^ 4 numbers $
const yearRE = new RegExp(/^\d{4}$/)
// Month/year: ^1-2 numbers '/' 4 numbers
const yearMonthRE = new RegExp(/^(\d){1,2}\/[12]{1}\d{3}$/)
// ^1-2 numbers '.' 1-2 numbers '.' 4 numbers
const dateRE = new RegExp(/^(\d){1,2}\.(\d){1,2}\.(\d){4}/)
// 1-2 numbers ':xx' $
const hourRE = new RegExp(/(\d){1,2}:xx$/)
// 1-2 numbers ':' 2 numbers $
const hourMinuteRE = new RegExp(/(\d){1,2}:(\d){2}$/)

export function getDateFromTimeComponents(comps) {
  let y = parseInt(comps[0], 10)
  let m = parseInt(comps[1], 10) - 1
  let d = parseInt(comps[2], 10)
  let h = parseInt(comps[3], 10)
  let mi = parseInt(comps[4], 10)

  if (isNaN(y)) return false
  if (isNaN(m)) m = 0
  if (isNaN(d)) d = 1
  if (isNaN(h)) h = 0
  if (isNaN(mi)) mi = 0

  return new Date(y, m, d, h, mi)
}

export function getTimeComponentsFromTimestamp(timestamp) {
  const t = timestamp.trim()
  let tokens = t.split(/\D/)

  if (yearRE.test(t)) {
    return [t, "", "", "", ""]
  }

  else if (yearMonthRE.test(t)) {
    if (1 <= parseInt(tokens[0], 10) <= 12) {
      return [tokens[1], tokens[0], "", "", ""]
    }
  }

  else if (dateRE.test(t)) {
    let day = parseInt(tokens[0], 10)
    let month = parseInt(tokens[1], 10)
    let year = parseInt(tokens[2], 10)
    
    if (hourRE.test(t)) {
      let hour = parseInt(tokens[3], 10)

      if (
        1 <= day && day <= 31 &&
        1 <= month && month <= 12 &&
        0 <= hour && hour <= 23
      ) {
        return [year.toString(), month.toString(), day.toString(), hour.toString(), ""]
      }

      return false
    }
    else if (hourMinuteRE.test(t)) {
      let hour = parseInt(tokens[3], 10)
      let minute = parseInt(tokens[4], 10)

      if (
        1 <= day && day <= 31 &&
        1 <= month && month <= 12 &&
        0 <= hour && hour <= 23 &&
        0 <= minute && minute <= 59
      ) {
        return [year.toString(), month.toString(), day.toString(), hour.toString(), minute.toString()]
      }
      return false
    }

    if (
      tokens.length === 3 &&
      1 <= day && day <= 31 &&
      1 <= month && month <= 12
    ) {
      return [year.toString(), month.toString(), day.toString(), "", ""]
    }
    return false  
  }
  return false
}

if (process.env.REACT_APP_API_URL === undefined) {
  throw Error('Environment variable REACT_APP_API_URL must be defined in .env file.')
}

const slash = process.env.REACT_APP_API_URL.slice(-1) !== '/' ? '/' : ''
const API_URL = process.env.REACT_APP_API_URL + slash

export class Api {
  static parseResponse(response) {
    if (response.ok) {
      return response.json()
    } else {
      throw Error('Pyyntöä ei voitu suorittaa virheen takia.')
    }
  }

  static getHeaders() {
    return {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }

  static getTags() {
    return fetch(API_URL + 'tags?frequencies=True', this.getHeaders())
    .then(response => this.parseResponse(response))
    .then(tagsFrequencies => {
      let tags = Object.keys(tagsFrequencies)
      tags.sort()

      return { ok: true, data: { tags: tags, tagsFrequencies: tagsFrequencies } }
    })
    .catch(err => {
      const msg = 'Tägien haussa palvelimelta tapahtui virhe: ' + err.message
      console.error(msg)
      return { ok: false, data: msg }
    })
  }

  static getEntries() {
    return fetch(API_URL + 'entries', this.getHeaders())
    .then(response => this.parseResponse(response))
    .then(data => {
      let entries = data.reverse()

      entries.forEach(e => {
        e.start_time = new Date(e.start_time)
      })

      return { ok: true, data: entries}
    }).catch(err => {
      const msg = 'Tapahtumien haussa palvelimelta tapahtui virhe: ' + err.message
      console.error(msg)
      return { ok: false, data: msg }
    })
  }

  static insertEntry(entry) {
    // Send new entry to backend
    return fetch(API_URL + 'entries', {
      ...this.getHeaders(),
      method: 'POST',
      body: JSON.stringify(entry),
    })
    .then(response => this.parseResponse(response))
    .then(data => {
      return { ok: true, data: data }
    })
    .catch(err => {
      const msg = 'Kirjauksen lisäys epäonnistui: ' + err.message
      console.error(msg)
      this.setState({ ok: false, data: msg})
    })
  }
}
