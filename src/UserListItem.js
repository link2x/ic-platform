import * as React from 'react'

import { auth, db } from './firebase'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, orderBy, query, onSnapshot, where, setIndexConfiguration } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'

import Card from '@mui/material/Card'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'

export default function UserListItem(props) {

  const [ enable, setEnable ] = React.useState(true) // I frankly have no clue why this is necessary.

  const id = props.id
  const index = props.index
  const onDelete = props.onDelete

  const [ displayName, setDisplayName ] = React.useState('')

  const [ deleteConfirm, setDeleteConfirm ] = React.useState(false)

  React.useEffect(() => {
    const userDocument = doc(db, 'users/', id)
    getDoc(userDocument).then((doc) => {
      setDisplayName(doc.data()?.displayName)
    })
  }, [id])

  if (id && enable) return(
    <Card sx={{p: '0.5em'}}>
      <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} key={index} alignItems={'center'}>
        <Typography>{displayName} ({id})</Typography>
        <Box sx={{flexGrow: 1}} />
        {deleteConfirm ?
          <Stack direction='row' spacing={2}>
            <Button variant='contained' size='small' color='error' onClick={() => {onDelete(); setEnable(false)}}>Confirm</Button>
            <Button variant='outlined' size='small' color='info' onClick={() => {setDeleteConfirm(false)}}>Cancel</Button>
          </Stack> : <Button variant='outlined' size='small' color='error' onClick={() => {setDeleteConfirm(true)}}>Remove</Button>}
      </Stack>
    </Card>
  )

}