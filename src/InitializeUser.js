import * as React from 'react'
import { auth, db } from './firebase'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, orderBy, query, onSnapshot, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'

import Avatar from '@mui/material/Avatar'

export default function InitializeUser() {

  const [user, loading, error] = useAuthState(auth);

  const [ userData, setUserData ] = React.useState(null);

  const userDocument = doc(db, 'users/', user.uid)

  const refreshUserData = () => {
    getDoc(userDocument).then((doc) => {
      setUserData(doc.data())
    })
  }

  const createUserData = () => {
    let newUserData = {
      displayName: user.email,
      emailAddress: user.email,
      userID: user.uid
    }
    setDoc(userDocument, newUserData).then(() => {
        refreshUserData()
    })
  }

  React.useEffect(() => {getDoc(userDocument).then((doc) => {
    if ((!doc.exists) || (!doc?.data()?.displayName)) {
      createUserData()
    } else {
      setUserData(doc.data())
    }
  })}, [user])

  return(
    <Avatar sx={{ width: 32, height: 32 }}>{userData?.displayName[0].toUpperCase()}</Avatar>
  )

}