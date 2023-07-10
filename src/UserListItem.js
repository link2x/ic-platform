import * as React from 'react'

import { auth, db } from './firebase'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, orderBy, query, onSnapshot, where, setIndexConfiguration } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'

export default function UserListItem(props) {

  const id = props.id
  const index = props.key

  const [ displayName, setDisplayName ] = React.useState('')

  const [ deleteConfirm, setDeleteConfirm ] = React.useState(false)

  React.useEffect(() => {
    const userDocument = doc(db, 'users/', id)
    getDoc(userDocument).then((doc) => {
      setDisplayName(doc.data()?.displayName)
    })
  }, [id])

  return(
    <Stack direction='row' spacing={2} key={index}>
      <Typography>{displayName} ({id})</Typography>
      <Box sx={{flexGrow: 1}} />
      {deleteConfirm ?
        <Stack direction='row'>
          <Button variant='contained' size='small' color='error' onClick={() => {setDeleteConfirm(false)}}>Confirm</Button>
          <Button variant='outlined' size='small' color='info' onClick={() => {setDeleteConfirm(false)}}>Cancel</Button>
        </Stack> : <Button variant='outlined' size='small' color='error' onClick={() => {setDeleteConfirm(true)}}>Remove</Button>}
    </Stack>
  )

}