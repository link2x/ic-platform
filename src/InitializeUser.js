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

  React.useEffect(() => {getDoc(userDocument).then((doc) => {
    if ((!doc.exists) || (!doc?.data()?.displayName)) {
      let newUserData = {
        displayName: user.email,
        emailAddress: user.email,
        userID: user.uid
      }
      setDoc(userDocument, newUserData).then(() => {
        getDoc(userDocument).then((doc) => {
          setUserData(doc.data())
        })
      })
    } else {
      setUserData(doc.data())
    }
  })}, [user, userDocument])

  return(
    <Avatar sx={{ width: 40, height: 40 }}>{userData?.displayName[0].toUpperCase()}</Avatar>
  )

}