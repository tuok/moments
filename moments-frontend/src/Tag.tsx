import { Chip } from '@mui/material'

export interface ITagProps {
    label: string
    handleDelete?: Function
}

const Tag = ({ label, handleDelete }: ITagProps) => (
    <Chip
        label={label}
        style={{
            marginTop: 5,
            marginRight: 6,
            boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.4)',
        }}
        onDelete={handleDelete ? () => handleDelete(label) : undefined}
    />
)

export default Tag
