import * as React from 'react'

import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'

import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import Link from 'next/link'

import { db } from './firebase'
import { doc, deleteDoc, setDoc, Timestamp } from 'firebase/firestore'

import { safetyRatings, itemCategories } from './constants'

export default function Item(props) {

    const itemData = props.itemData
    const userID = props.userID
    const readOnly = props.readOnly

    const [ editMode, setEditMode ] = React.useState(false)
    const [ updating, setUpdating ] = React.useState(false)
    const [ editName, setEditName ] = React.useState(itemData.name)
    const [ editRating, setEditRating ] = React.useState(itemData.rating)
    const [ editCategory, setEditCategory ] = React.useState(itemData?.category)

    const [ deleteDialog, setDeleteDialog ] = React.useState(false)

    const itemDocument = doc(db, 'items/' + userID + '/items/' + itemData.itemID)

    const handleDelete = () => {
        setUpdating(true)
        deleteDoc(itemDocument).then(() => {
            setDeleteDialog(false)
            setUpdating(false)
        })
    }

    const handleOpenDeleteDialog = () => {
        setDeleteDialog(true)
    }

    const handleCloseDeleteDialog = () => {
        setDeleteDialog(false)
    }

    const handleEditMode = () => {
        setUpdating(false)
        setEditMode(true)
    }

    const handleCancelEditMode = () => {
        setEditMode(false)
    }

    const handleEditUpdate = () => {
        setUpdating(true)
        setDoc(itemDocument, {
            name: editName,
            rating: editRating,
            category: editCategory,
            updateTimestamp: Timestamp.now()
        }, { merge: true }).then(() => {
            setEditMode(false)
            setUpdating(false)
        })
    }

    const getDangerLevelColor = (level) => {
        if (level > 3) {return 'error'}
        else if (level > 2) {return 'warning'}
        else if (level == 1) {return 'success'}
        else {return 'info'}
    }

    const displayDeleteDialog =
        <Dialog maxWidth='lg' fullWidth open={deleteDialog} onClose={handleCloseDeleteDialog}>
            <DialogTitle>Delete this item?</DialogTitle>
            <DialogContent>
                <DialogContentText>This action cannot be undone.</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button disabled={updating} onClick={handleCloseDeleteDialog}>Cancel</Button>
                <Button variant='contained' color='error' disabled={updating} onClick={handleDelete}>Delete</Button>
            </DialogActions>
        </Dialog>

    const displayNormal = 
        <Grid container direction='row' spacing={2} sx={{alignItems: 'center', p: '1em'}}>
            {displayDeleteDialog}
            <Grid item xs={12} sm={12} md={10}>
                <Grid container direction='row' spacing={1} sx={{alignItems: 'center'}}>
                <Grid item xs={12} sm={6} md={5}>
                <Chip variant='filled' color={getDangerLevelColor(itemData.rating)} label={itemData.name} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={5}>
                        <Chip variant='filled' color={getDangerLevelColor(itemData.rating)} label={safetyRatings[itemData.rating]} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={5}>
                        <Typography textAlign={'center'} >{itemCategories[itemData.category]}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
                        <Chip size='small' label={
                            <Typography variant='caption'>Last Updated: {
                                itemData?.updateTimestamp ? itemData?.updateTimestamp?.toDate().toLocaleString()
                                    : itemData.createTimestamp.toDate().toLocaleString()
                            }</Typography>
                    } />
                    </Grid>
                </Grid>
            </Grid>
            <Box sx={{flexGrow: 1}} />
            {!readOnly &&
                <>
                    <Grid item xs={12} sm={6} md={1} xl={1}>
                        <Button fullWidth variant='outlined' onClick={handleEditMode}>Edit</Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={1} xl={1}>
                        <Button fullWidth variant='outlined' color='error' onClick={handleOpenDeleteDialog}>Delete</Button>
                    </Grid>
                </>
            }
        </Grid>

    const displayEdit =
        <Grid container direction='row' spacing={2} sx={{alignItems: 'center', p: '1em'}}>
            <Grid item xs={12} sm={12} md={10}>
                <Stack direction='column' spacing={2}>
                    <TextField fullWidth size='small' label='Name' disabled={updating} value={editName} onChange={(e) => {setEditName(e.target.value)}} />
                    <Select disabled={updating} value={editRating} onChange={(e) => {setEditRating(e.target.value)}}>
                        {safetyRatings.map((ratingText, ratingValue) => 
                            <MenuItem key={ratingValue} value={ratingValue}>{ratingText}</MenuItem>
                        )}
                    </Select>
                    <Select fullWidth disabled={updating} value={editCategory} onChange={(e) => {setEditCategory(e.target.value)}}>
                        <MenuItem value={-1}>No Category</MenuItem>
                        {itemCategories.map((categoryText, categoryValue) => 
                            <MenuItem key={categoryValue} value={categoryValue}>{categoryText}</MenuItem>
                        )}
                    </Select>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={1}>
                <Button fullWidth variant='outlined' color='error' disabled={updating} onClick={handleCancelEditMode}>Cancel</Button>
            </Grid>
            <Grid item xs={12} sm={6} md={1}>
                <Button fullWidth variant='contained' color='primary' disabled={updating} onClick={handleEditUpdate}>Submit</Button>
            </Grid>
        </Grid>

    return(
        <Card elevation={2}>
            {editMode ? displayEdit : displayNormal}
        </Card>
    )
}