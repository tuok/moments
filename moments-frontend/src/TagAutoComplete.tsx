import { MenuItem, Paper, Popper, TextField } from '@material-ui/core'
import React, { useState } from 'react'

export interface ITagAutoCompleteProps {
    tags: string[]
    frequencies: Record<string, number>
    maxResults: number
    threshold: number
    onTagSelected: Function
    deleteCallback?: Function
}

const TagAutoComplete = (props: ITagAutoCompleteProps) => {
    const { tags, maxResults, frequencies, onTagSelected, threshold, deleteCallback } = props

    const [foundTags, setFoundTags] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [anchorElement, setAnchorElement] = useState<any>(null)
    const [selectedIndex, setSelectedIndex] = useState<number>(0)

    const defaultIndex = 0

    console.log('Render')

    const handleSearchTermChange = async (target: any, term: string) => {
        const lowerTerm = term.toLowerCase()
        setSearchTerm(lowerTerm)

        if (lowerTerm.length < threshold) {
            setFoundTags([])
            return
        }

        let foundTags_ = tags.filter(tag => tag.includes(lowerTerm))

        foundTags_.sort((tag1, tag2) => {
            let i1 = tag1.indexOf(lowerTerm)
            let i2 = tag2.indexOf(lowerTerm)

            // First compare search term location in tag
            if (i1 < i2) return -1
            if (i1 > i2) return 1

            let aFreq = frequencies[tag1]
            let bFreq = frequencies[tag2]

            // If term location is same, compare tag frequencies
            if (aFreq < bFreq) return 1
            if (aFreq > bFreq) return -1

            return 0
        })

        foundTags_ = foundTags_.slice(0, maxResults)

        setFoundTags(foundTags_)
        setAnchorElement(target)
        setSelectedIndex(defaultIndex)
    }

    const resetComponent = async () => {
        setSearchTerm('')
        setAnchorElement(null)
        setSelectedIndex(0)
        setFoundTags([])
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            let newIndex = selectedIndex

            if (e.key === 'ArrowUp') {
                newIndex = --newIndex < 0 ? foundTags.length - 1 : newIndex
            } else if (e.key === 'ArrowDown') {
                newIndex = ++newIndex >= foundTags.length ? 0 : newIndex
            }

            setSelectedIndex(newIndex)
            e.preventDefault()
        } else if (e.key === 'Enter') {
            if (foundTags.length > 0 && selectedIndex >= 0) {
                tagSelected(foundTags[selectedIndex])
            } else {
                tagSelected(searchTerm)
            }
        } else if (e.key === 'Escape' && foundTags.length > 0) {
            // // If tag is selected, remove selection.
            // if (foundTags.length > 0 && selectedIndex >= 0) {
            //     setSelectedIndex(defaultIndex)
            // }

            // If tags are visible, hide them.
            if (foundTags.length > 0) {
                setFoundTags([])
            }

            // If tags are not visible, erase search term.
            else {
                resetComponent()
            }
        } else if (e.key === 'Delete' && deleteCallback && searchTerm.length < 1) {
            deleteCallback()
        }
    }

    const tagSelected = (tag: string) => {
        resetComponent()
        onTagSelected(tag)
    }

    const tagItems = foundTags.map((tag, i) => {
        return (
            <MenuItem key={tag} onClick={e => tagSelected(tag)} onKeyDown={handleKeyPress} selected={i === selectedIndex}>
                {tag}
            </MenuItem>
        )
    })

    return (
        <>
            <TextField
                fullWidth
                style={{ marginTop: 0 }}
                margin="normal"
                label="Hae tägejä kirjoittamalla (delete poistaa viimeisimmän valitun tägin)"
                onChange={e => handleSearchTermChange(e.currentTarget, e.target.value)}
                onKeyDown={handleKeyPress}
                value={searchTerm}
            />
            <Popper open={Boolean(anchorElement)} anchorEl={anchorElement} placement="bottom-start" style={{ zIndex: 1000000 }}>
                <Paper>{tagItems}</Paper>
            </Popper>
        </>
    )
}

export default TagAutoComplete
