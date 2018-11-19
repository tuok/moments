import { func } from "prop-types";

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

export function getTimeComponentsFromTimestamp(timestamp) {
  const t = timestamp.trim()

  if (yearRE.test(t)) {
    return [t, "1", "1", "0", "0"]
  }

  else if (yearMonthRE.test(t)) {
    let tokens = t.split(/\D/)

    if (1 <= parseInt(tokens[0], 10) <= 12) {
      return [tokens[1], tokens[0], "1", "0", "0"]
    }
  }

  else if (dateRE.test(t)) {
    let tokens = t.split(/\D/)
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
        return [year.toString(), month.toString(), day.toString(), hour.toString(), "0"]
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
      return [year.toString(), month.toString(), day.toString(), "0", "0"]
    }
    return false  
  }
  return false
}
