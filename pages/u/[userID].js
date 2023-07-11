import * as React from 'react'
import { useRouter } from "next/router"

import { auth, db } from '../../src/firebase'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, orderBy, query, onSnapshot, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography';

import LoginBox from '../../src/LoginBox';
import ItemList from '../../src/ItemList';
import UserBar from '../../src/UserBar';
import Footer from '../../src/Footer';

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
    }, [ userID, forceUpdate, user, itemData ] )

    React.useMemo(() => {
        if (user) {
            const userDocument = doc(db, 'users/', user.uid)
            getDoc(userDocument).then((doc) => {
                setUserData(doc.data())
            })
        }
    }, [ user ])

    if ((user && userItemData?.allowView?.includes(user.uid)) || (userItemData?.private == false)) return (
        <Container maxWidth='xl' sx={{mt: '1em'}}>
            {user && <UserBar user={user} router={router} />}
            <ItemList readOnly userID={userID} itemData={itemData} />
            <Footer router={router} />
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