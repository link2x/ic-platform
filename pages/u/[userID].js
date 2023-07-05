import * as React from 'react'
import { useRouter } from "next/router"

import { auth, db } from '../../src/firebase'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, orderBy, query, onSnapshot, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

import RefreshIcon from '@mui/icons-material/Refresh'

import Item from '../../src/Item';
import CreateItem from '../../src/CreateItem';
import LoginBox from '../../src/LoginBox';
import ItemList from '../../src/ItemList';

export default function ShowUserItems() {
    const router = useRouter()
    const userID = router.query.userID

    const [user, loading, error] = useAuthState(auth);

    const [ username, setUsername ] = React.useState();
    const [ password, setPassword ] = React.useState();

    const [ userData, setUserData ] = React.useState();
    const [ userItemData, setUserItemData ] = React.useState();
    const [ itemData, setItemData ] = React.useState([]);

    const [ forceUpdate, setForceUpdate ] = React.useState(0);

    const triggerRefresh = () => {
        setForceUpdate(forceUpdate + 1)
    }

    const getUser = () => {
        const userDocument = doc(db, 'users/', user.uid)
        getDoc(userDocument).then((doc) => {
            setUserData(doc.data())
        })
    }

    React.useEffect(() => {
        const userItemDocument = doc(db, 'items/'+userID)
        getDoc(userItemDocument).then((doc) => {
            setUserItemData(doc.data())
        })
    }, [userID])

    React.useEffect(() => {
        if (userID) {

        const itemCollection = collection(db, 'items/' + userID + '/items')
        const itemQuery = query(itemCollection, orderBy('createTimestamp', 'desc'))
        const unsubGetItems = onSnapshot(itemQuery, (docs) => {
                let newItemData = []
                docs.forEach((doc) => {
                    let newItem = doc.data()
                    newItem.itemID = doc.id
                    itemData.findIndex(e => e.itemID==newItem.itemID) === -1 ? newItemData.push(newItem) : null
                })
                setItemData(newItemData)
        })

        return () => unsubGetItems()
        }
    }, [ userID, forceUpdate, user ] )

    React.useMemo(() => {
        if (user) {
            getUser()
        }
    }, [ user ])

    if ((user && userItemData?.allowView?.includes(user.uid)) || (userItemData?.private == false)) return (
        <Container maxWidth='xl' sx={{mt: '1em'}}>
            {user && <Stack direction='row' spacing={2} sx={{pb: '1em', alignItems: 'center'}}>
                <Typography>Signed In As {user.email}</Typography>
                <Box sx={{flexGrow: 1}} />
                <Button variant='contained' onClick={() => signOut(auth)}>Sign Out</Button>
            </Stack>}
            <ItemList readOnly userID={userID} itemData={itemData} />
        </Container>
    )
    else if (loading || !userItemData) return (<div>Loading...</div>)
    else if (!user) return(
        <Container maxWidth='xl'>
            <Stack direction='column' sx={{my: '4em', alignItems: 'center'}}>
                <Typography variant='h5'>This list is private, please sign in.</Typography>
            </Stack>
            <LoginBox />
        </Container>
    )
    else if (user) return (
        <div>
            Loading...
        </div>
    )
}