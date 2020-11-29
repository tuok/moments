import React from 'react'

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

export const findIndicesOfSubstring = (text: string, pattern: string) => {
    const iText = text.toLowerCase()
    const iPattern = pattern.toLowerCase()

    const indices = []
    let foundIndex = -1
    let startIndex = 0

    while ((foundIndex = iText.indexOf(iPattern, startIndex)) > -1) {
        indices.push(foundIndex)
        startIndex = foundIndex + iPattern.length
    }

    return indices
}

export const textToBoldComponents = (text: string, pattern?: string) => {
    if (!pattern) {
        return text
    }

    const indices = findIndicesOfSubstring(text, pattern)

    const tokens = []
    let prevIndex = 0

    for (let i1 of indices) {
        let i2 = i1 + pattern.length

        tokens.push(text.slice(prevIndex, i1), <b style={{ color: 'blue' }}>{text.slice(i1, i2)}</b>)

        prevIndex = i2
    }

    tokens.push(text.slice(prevIndex))

    return tokens
}

const utc = (y: number, mo: number, d = 1, h = 0, mi = 0) => new Date(Date.UTC(y, mo - 1, d, h, mi))

export const parseStringDate = (dateStr: string): Date | undefined => {
    const t = dateStr.trim()
    let tokens = t.split(/\D/)

    // yyyy
    if (yearRE.test(t)) {
        return utc(parseInt(t, 10), 1, 1)
    }

    // mm/yyyy
    else if (yearMonthRE.test(t)) {
        const month = parseInt(tokens[0], 10)
        const year = parseInt(tokens[1], 10)

        if (month >= 1 && month <= 12) {
            return utc(year, month, 1)
        }

        return undefined
    } else if (dateRE.test(t)) {
        // Check year length
        if (tokens[2].length > 4) {
            return undefined
        }

        let day = parseInt(tokens[0], 10)
        let month = parseInt(tokens[1], 10)
        let year = parseInt(tokens[2], 10)

        if (hourRE.test(t)) {
            let hour = parseInt(tokens[3], 10)

            if (1 <= day && day <= 31 && 1 <= month && month <= 12 && 0 <= hour && hour <= 23) {
                return utc(year, month, day, hour, 0)
            }

            return undefined
        } else if (hourMinuteRE.test(t)) {
            let hour = parseInt(tokens[3], 10)
            let minute = parseInt(tokens[4], 10)

            if (1 <= day && day <= 31 && 1 <= month && month <= 12 && 0 <= hour && hour <= 23 && 0 <= minute && minute <= 59) {
                return utc(year, month, day, hour, minute)
            }

            return undefined
        }

        if (tokens.length === 3 && 1 <= day && day <= 31 && 1 <= month && month <= 12) {
            return utc(year, month, day)
        }

        return undefined
    }

    return undefined
}

export enum DateType {
    BeginDate,
    EndDate,
}

export const handleDateChangeGeneral = (
    type: DateType,
    dateStr: string,
    beginDateKey: string,
    endDateKey: string,
    setBeginDateError: Function,
    setEndDateError: Function
) => {
    const stateFunc = type === DateType.BeginDate ? setBeginDateError : setEndDateError
    const beginEnd = type === DateType.BeginDate ? beginDateKey : endDateKey

    if (dateStr.length < 1) {
        stateFunc(false)
        return [beginEnd, null]
    }

    const parsedDate = parseStringDate(dateStr)

    if (parsedDate) {
        stateFunc(false)
        return [beginEnd, parsedDate]
    } else {
        stateFunc(true)
        return null
    }
}
