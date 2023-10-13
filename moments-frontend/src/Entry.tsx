import { useState } from 'react'
import {
    Card,
    CardContent,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Typography,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import { IEntry } from './Models'
import Tag from './Tag'
import { textToBoldComponents } from './Utils'

interface IEntryProps {
    entry: IEntry
    entryEditCallback: Function
    handleEntryModified: Function
    deleteCallback: Function
    searchPattern?: string
}

const Entry = (props: IEntryProps) => {
    const { entry, entryEditCallback, searchPattern, deleteCallback } = props

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [menuAnchorElement, setMenuAnchorElement] = useState<any>(null)
    const menuOpen = Boolean(menuAnchorElement)

    const handleEntryMenuClick = (event: React.MouseEvent) => {
        setMenuAnchorElement(event.currentTarget)
    }

    const handleMenuClose = () => {
        setMenuAnchorElement(null)
    }

    const formatEntryTime = () => {
        let formattedTime = entry.start_readable_timestamp

        if (entry.end_readable_timestamp) {
            // Check if both timestamps have time defined (hh:mm / hh:xx)
            if (
                formattedTime.indexOf(':') > 0 &&
                entry.end_readable_timestamp.indexOf(':') > 0
            ) {
                // dd.MM.yyyy|hh:mm, where | marks place of sep(arator)
                const sep = formattedTime.length - 6
                const startTimeHead = entry.start_readable_timestamp.substring(
                    0,
                    sep - 1
                )
                const endTimeHead = entry.end_readable_timestamp.substring(
                    0,
                    sep - 1
                )

                // end could be:
                // hh:mm, if start & end dates are the same
                // dd.MM.yyyy, if start & end dates differ
                const end =
                    startTimeHead === endTimeHead
                        ? entry.end_readable_timestamp.substring(sep)
                        : entry.end_readable_timestamp

                formattedTime = `${formattedTime} - ${end}`
            } else {
                formattedTime = `${formattedTime} - ${entry.end_readable_timestamp}`
            }
        }

        return formattedTime
    }

    return (
        <Card
            elevation={3}
            style={{
                marginTop: 10,
                marginLeft: 10,
                marginRight: 10,
            }}
        >
            <CardContent>
                <div>
                    {entry.title !== null ? (
                        <Typography
                            variant="h5"
                            style={{ marginBottom: 0, display: 'inline-block' }}
                        >
                            {entry.title}
                        </Typography>
                    ) : null}
                    <IconButton
                        onClick={handleEntryMenuClick}
                        style={{ float: 'right' }}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        open={menuOpen}
                        anchorEl={menuAnchorElement}
                        keepMounted
                        onClose={handleMenuClose}
                    >
                        <MenuItem
                            onClick={() => {
                                handleMenuClose()
                                entryEditCallback(entry)
                            }}
                        >
                            <EditIcon style={{ marginRight: 10 }} />
                            Muokkaa
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleMenuClose()
                                deleteCallback(entry)
                            }}
                        >
                            <DeleteIcon style={{ marginRight: 10 }} /> Poista
                        </MenuItem>
                    </Menu>
                </div>
                <Typography variant="h6" style={{ color: '#666' }}>
                    {formatEntryTime()}
                </Typography>
                <Divider style={{ marginTop: 10 }} />
                <Typography style={{ marginTop: 15, whiteSpace: 'pre-line' }}>
                    {textToBoldComponents(entry.text, searchPattern)}
                </Typography>
                <Typography variant="h6" style={{ marginTop: 20 }}>
                    Tägit
                </Typography>
                {entry.tags.map((tag) => (
                    <Tag key={tag} label={tag} />
                ))}
            </CardContent>
        </Card>
    )
}

export default Entry
