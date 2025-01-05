import { useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { TextField, Button } from '@mui/material'

import TagAutoComplete from './TagAutoComplete'
import { IEntry } from './Models'
import { DateType, handleDateChangeGeneral } from './Utils'
import Api from './Api'

export interface IEntryEditProps {
    tags: string[]
    frequencies: Record<string, number>
    entry: IEntry
    handleClose: Function
    handleEntryModified: Function
}

const EntryEdit = (props: IEntryEditProps) => {
    const { entry, frequencies, handleClose, tags, handleEntryModified } = props

    const [modifiedEntry, setModifiedEntry] = useState(entry)
    const [startDateError, setStartDateError] = useState<boolean>(false)
    const [endDateError, setEndDateError] = useState<boolean>(false)
    const [cancelClickCount, setCancelClickCount] = useState(0)

    const newEntry = entry.id === -1

    const handleDateChange = (type: DateType, dateStr: string) => {
        const result = handleDateChangeGeneral(
            type,
            dateStr,
            'start_time',
            'end_time',
            setStartDateError,
            setEndDateError
        )

        if (result) {
            const [key_, value] = result
            const key = key_ as string

            setModifiedEntry((prevEntry) => {
                const tempEntry = { ...prevEntry, [key]: value }

                if (type === DateType.BeginDate) {
                    tempEntry.start_readable_timestamp = dateStr
                } else {
                    tempEntry.end_readable_timestamp = dateStr
                }

                return tempEntry
            })
        }
    }

    return (
        <Dialog
            open={true}
            onClose={(_) => handleClose()}
            // disableBackdropClick={true}
            disableEscapeKeyDown={true}
        >
            <DialogTitle>
                {newEntry ? 'Uusi kirjaus' : 'Kirjauksen muokkaus'}
            </DialogTitle>
            <DialogContent>
                <TextField
                    required
                    autoFocus
                    fullWidth
                    margin="normal"
                    id="title"
                    label="Kirjauksen otsikko"
                    defaultValue={modifiedEntry.title}
                    onBlur={(e) =>
                        setModifiedEntry((prevEntry: IEntry) => ({
                            ...prevEntry,
                            title: e.target.value,
                        }))
                    }
                />
                <TextField
                    required
                    fullWidth
                    multiline
                    // rowsMax="20"
                    margin="normal"
                    id="text"
                    label="Kirjauksen teksti"
                    defaultValue={modifiedEntry.text}
                    onBlur={(e) =>
                        setModifiedEntry((prevEntry: IEntry) => ({
                            ...prevEntry,
                            text: e.target.value,
                        }))
                    }
                />
                <TagAutoComplete
                    initialSelectedTags={modifiedEntry.tags}
                    tags={tags}
                    frequencies={frequencies}
                    threshold={2}
                    maxResults={6}
                    onTagsChanged={(tags: string[]) =>
                        setModifiedEntry((prevEntry: IEntry) => ({
                            ...prevEntry,
                            tags: tags,
                        }))
                    }
                />
                <TextField
                    error={startDateError}
                    required
                    fullWidth
                    margin="normal"
                    id="startTimestamp"
                    label="Alkuajankohta"
                    defaultValue={modifiedEntry.start_readable_timestamp}
                    onChange={(e) =>
                        handleDateChange(DateType.BeginDate, e.target.value)
                    }
                />
                <TextField
                    error={endDateError}
                    fullWidth
                    margin="normal"
                    id="endTimestamp"
                    label="Loppuajankohta"
                    defaultValue={modifiedEntry.end_readable_timestamp}
                    onChange={(e) =>
                        handleDateChange(DateType.EndDate, e.target.value)
                    }
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={(_) => {
                        if (cancelClickCount === 2) handleClose()
                        else setCancelClickCount((prevCount) => prevCount + 1)
                    }}
                >
                    Peruuta
                </Button>

                <Button
                    onClick={(_) =>
                        Api.saveEntry(modifiedEntry, () => {
                            const removedTags = entry.tags.filter(
                                (tag) => !modifiedEntry.tags.includes(tag)
                            )
                            const addedTags = modifiedEntry.tags.filter(
                                (tag) => !entry.tags.includes(tag)
                            )

                            console.info('Entry saved successfully!')

                            handleEntryModified(addedTags, removedTags)
                            handleClose()
                        })
                    }
                >
                    {newEntry ? 'Lisää kirjaus' : 'Tallenna kirjaus'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EntryEdit
