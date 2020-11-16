import { Paper, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { ISearchData, defaultSearchData } from './Models'
import Tag from './Tag'

import TagAutoComplete from './TagAutoComplete'
import { parseStringDate } from './Utils'

export interface IEntrySearchProps {
    tagsFrequencies: Record<string, number>
    searchDataUpdatedCallback: Function
}

enum DateType {
    BeginDate,
    EndDate,
}

const EntrySeach = (props: IEntrySearchProps) => {
    const { tagsFrequencies, searchDataUpdatedCallback } = props

    const [searchData, setSearchData] = useState<ISearchData>(defaultSearchData)
    const [startDateError, setStartDateError] = useState<boolean>(false)
    const [endDateError, setEndDateError] = useState<boolean>(false)

    const tags = Object.keys(tagsFrequencies)

    const handleFullTextSearchTermChange = (searchTerm: string) => {
        const term = searchTerm.length < 3 ? undefined : searchTerm
        const newSearchData = { ...searchData, searchTerm: term }

        searchDataUpdatedCallback(newSearchData)
        setSearchData(newSearchData)
    }

    const handleTagSelected = (newTag: string) => {
        if (!searchData.tags?.includes(newTag)) {
            const newSearchData = { ...searchData, tags: [...searchData.tags!, newTag] }

            searchDataUpdatedCallback(newSearchData)
            setSearchData(newSearchData)
        }
    }

    const handleRemoveLastTag = () => {
        if (searchData.tags && searchData.tags.length > 0) {
            const tagToRemove = searchData.tags[searchData.tags.length - 1]
            removeTag(tagToRemove)
        }
    }

    const removeTag = (tagToRemove: string) => {
        if (searchData.tags?.includes(tagToRemove)) {
            const newSearchData = { ...searchData, tags: searchData.tags!.filter(tag => tag !== tagToRemove) }

            searchDataUpdatedCallback(newSearchData)
            setSearchData(newSearchData)
        }
    }

    const handleDateChange = (type: DateType, dateStr: string) => {
        const stateFunc = type === DateType.BeginDate ? setStartDateError : setEndDateError
        const beginEnd = type === DateType.BeginDate ? 'startDate' : 'endDate'

        if (dateStr.length < 1) {
            stateFunc(false)
            const newSearchData = { ...searchData, [beginEnd]: null }
            setSearchData(newSearchData)
            searchDataUpdatedCallback(newSearchData)
            return
        }

        const parsedDate = parseStringDate(dateStr)

        if (parsedDate) {
            console.log('Parsed date:', parsedDate)
            const newSearchData = { ...searchData, [beginEnd]: parsedDate }

            stateFunc(false)
            setSearchData(newSearchData)
            searchDataUpdatedCallback(newSearchData)
        } else {
            stateFunc(true)
        }
    }

    const handleReverseChange = () => {
        const newSearchData = { ...searchData, reverse: !searchData.reverse }

        setSearchData(newSearchData)
        searchDataUpdatedCallback(newSearchData)
    }

    return (
        <Paper style={{ paddingTop: 5, paddingLeft: 10, paddingRight: 10, paddingBottom: 10, marginLeft: 10, marginRight: 10 }}>
            <TagAutoComplete
                tags={tags}
                frequencies={tagsFrequencies}
                maxResults={6}
                onTagSelected={handleTagSelected}
                threshold={1}
                deleteCallback={handleRemoveLastTag}
            />
            {searchData.tags ? searchData.tags.map(tag => <Tag key={tag} label={tag} handleDelete={removeTag} />) : null}
            <TextField
                label="Hae kirjauksia merkkijonon perusteella (full-text search)"
                onChange={e => handleFullTextSearchTermChange(e.target.value)}
                fullWidth
                style={{ marginTop: 5 }}
            />
            <TextField
                error={startDateError}
                label="Hae kirjauksia jälkeen ajanhetken"
                onChange={e => handleDateChange(DateType.BeginDate, e.target.value)}
                fullWidth
                style={{ marginTop: 5 }}
            />
            <TextField
                error={endDateError}
                label="Hae kirjauksia ennen ajanhetkeä"
                onChange={e => handleDateChange(DateType.EndDate, e.target.value)}
                fullWidth
                style={{ marginTop: 5 }}
            />
            <label>
                <input
                    type="checkbox"
                    checked={searchData.reverse}
                    onChange={handleReverseChange}
                    style={{ marginLeft: 2, marginTop: 20 }}
                />
                &nbsp;&nbsp;Järjestä vanhimmasta uusimpaan
            </label>
        </Paper>
    )
}

export default EntrySeach
