import * as React from 'react'

import { v4 as uuidv4 } from 'uuid';

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Stack from '@mui/material/Stack'
import DialogContentText from '@mui/material/DialogContentText'

import { db } from './firebase'
import { doc, setDoc, Timestamp } from 'firebase/firestore'

import { safetyRatings, itemCategories } from './constants'

export default function CreateItem(props) {

    const itemData = props.itemData
    const userID = props.userID

    const [ name, setName ] = React.useState('')
    const [ rating, setRating ] = React.useState(0)
    const [ category, setCategory ] = React.useState(-1)

    const [ updating, setUpdating ] = React.useState(false)
    const [ error, setError ] = React.useState('')

    const [ createDialog, setCreateDialog ] = React.useState(false)

    const handleOpenCreateDialog = () => {
        setCreateDialog(true)
    }

    const handleCloseCreateDialog = () => {
        setUpdating(false)
        setCreateDialog(false)
    }

    const makeItem = () => {

        let newItemID = uuidv4()

        setUpdating(true)
        if (name && (itemData.findIndex(e => e.itemID==newItemID) === -1)) {
            const linkDocument = doc(db, 'items/' + userID + '/items/' + newItemID)
            let newItemData = {
                name: name,
                rating: rating,
                category: category,
                createTimestamp: Timestamp.now(),
                updateTimestamp: Timestamp.now()
            }
            setDoc(linkDocument, newItemData).then(() => {
                setName('')
                setRating(0)
                setCategory(-1)
                handleCloseCreateDialog()
            })
        } else if (!name) {
            setError('Please enter an item name.')
            setUpdating(false)
        }
    }

    const displayCreateDialog =
        <Dialog maxWidth='lg' fullWidth open={createDialog} onClose={handleCloseCreateDialog}>
            <DialogTitle>Add new item?</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{py: '0.25em'}}>
                    {error && <Alert severity='error'>{error}</Alert>}
                    <TextField fullWidth value={name}
                        disabled={updating}
                        onChange={(e) => {
                            setName(e.target.value)
                            setError('')
                            }} label='Item Name' />
                    <Select fullWidth disabled={updating} value={rating} onChange={(e) => {setRating(e.target.value)}}>
                        {safetyRatings.map((ratingText, ratingValue) => 
                            <MenuItem key={ratingValue} value={ratingValue}>{ratingText}</MenuItem>
                        )}
                    </Select>
                    <Select fullWidth disabled={updating} value={category} onChange={(e) => {setCategory(e.target.value)}}>
                        <MenuItem value={-1}>No Category</MenuItem>
                        {itemCategories.map((category, categoryValue) => 
                            <MenuItem key={categoryValue} value={category.categoryID}>{category.categoryName}</MenuItem>
                        )}
                    </Select>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button disabled={updating} onClick={handleCloseCreateDialog}>Cancel</Button>
                <Button variant='contained' color='primary' disabled={updating} onClick={makeItem}>Create</Button>
            </DialogActions>
        </Dialog>

    return(
        <>
            <Fab color="primary" aria-label="add"
                onClick={handleOpenCreateDialog}
                sx={{
                margin: 0,
                top: 'auto',
                right: 20,
                bottom: 20,
                left: 'auto',
                position: 'fixed'}}>
                <AddIcon />
            </Fab>
            {displayCreateDialog}
        </>
    )
}