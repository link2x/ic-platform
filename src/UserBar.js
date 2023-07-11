import * as React from 'react'

import { auth, db } from './firebase'
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
import Alert from '@mui/material/Alert';

import RefreshIcon from '@mui/icons-material/Refresh'

import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Home from '@mui/icons-material/Home';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Switch from '@mui/material/Switch';

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'

import InitializeUser from './InitializeUser';
import UserListItem from './UserListItem';

export default function UserBar(props) {

  const user = props.user
  const showURL = props.showURL
  const router = props.router

  const [ userData, setUserData ] = React.useState(null);

  const [ displayName, setDisplayName ] = React.useState('')
  const [ privateMode, setPrivateMode ] = React.useState(false)
  const [ userList, setUserList ] = React.useState([])
  const [ addEmail, setAddEmail ] = React.useState('')

  const [ userItemData, setUserItemData ] = React.useState();

  const [ updating, setUpdating ] = React.useState(false)
  const [ error, setError ] = React.useState('')

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null)
  }

  const userDocument = doc(db, 'users/', user.uid)

  React.useEffect(() => {
    getDoc(userDocument).then((doc) => {
      setUserData(doc.data())
      setDisplayName(doc.data()?.displayName)
    })

    const userItemDocument = doc(db, 'items/'+user.uid)
    getDoc(userItemDocument).then((doc) => {
        setUserItemData(doc.data())
    })
  }, [user])

  React.useEffect(() => {
    setPrivateMode(userItemData?.private)
    setUserList(userItemData?.allowView)
  }, [userItemData])

  React.useEffect(() => {
    console.log(userList)
  }, [userList])

  const [ settingsDialog, setSettingsDialog ] = React.useState(false)

  const handleOpenSettingsDialog = () => {
      setSettingsDialog(true)
  }

  const handleCloseSettingsDialog = () => {
      setError('')
      setAddEmail('')
      setDisplayName(userData?.displayName)
      setPrivateMode(userItemData?.private)
      setUserList(userItemData?.allowView)
      setSettingsDialog(false)
  }

  const handleAddEmail = async () => {
    setUpdating(true)
    if (!addEmail) {
      setError('Please enter an email address of a registered user.')
      setUpdating(false)
    } else {
      const userCollection = collection(db, '/users')
      const userQuery = query(userCollection, where('emailAddress', '==', addEmail))

      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.size) {
        setError('There is no user with that email address.')
        setUpdating(false)
      }

      querySnapshot.forEach((doc) => {
        if (userList.includes(doc.id)) {
          setError('This user is already a trusted user.')
          setUpdating(false)
        } else {
          setUserList(userList.concat(doc.id))
          setUpdating(false)
        }
      });

      const userDocument = doc(db, 'users/', user.uid)
      getDoc(userDocument).then((doc) => {
        setUserData(doc.data())
        setDisplayName(doc.data()?.displayName)
      })
    }
  }

  const handleDeleteUser = (index) => {
    let newUserList = userList
    newUserList.splice(index, 1)
    setUserList(newUserList)
    console.log(newUserList)
  }

  const handleUpdateUser = () => {
    setUpdating(true)

    const userDocument = doc(db, 'users/' + user.uid)
    let newUserData = {
        displayName: displayName
    }
    setDoc(userDocument, newUserData, {merge: true}).then(() => {
      const settingsDocument = doc(db, 'items/' + user.uid)
      let newSettingsData = {
          private: privateMode,
          allowView: userList
      }
      setDoc(settingsDocument, newSettingsData, {merge: true}).then(() => {
        getDoc(userDocument).then((doc) => {
          setUserData(doc.data())
          setDisplayName(doc.data()?.displayName)
        }).then(() => {
          const userItemDocument = doc(db, 'items/'+user.uid)
          getDoc(userItemDocument).then((doc) => {
              setUserItemData(doc.data())
              setUpdating(false)
          }).then(() => {
            setSettingsDialog(false)
          })
        })
      })
    })
  }

  return(
    <Grid container spacing={2} sx={{py: '1em', alignItems: 'center'}}>
      
      <Dialog maxWidth='lg' fullWidth open={settingsDialog} onClose={handleCloseSettingsDialog}>
            <DialogTitle>Settings</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{py: '0.25em'}}>
                    {error && <Alert severity='error'>{error}</Alert>}
                    <Typography>Profile</Typography>
                    <TextField fullWidth value={displayName}
                        disabled={updating}
                        onChange={(e) => {
                            setDisplayName(e.target.value)
                            setError('')
                            }} label='Display Name' />
                    <Tooltip followCursor title='Limits viewing to only trusted users.'>
                      <Stack direction='row' alignItems={'center'}>
                        <Typography variant='body2'>Private Profile</Typography>
                        <Box sx={{flexGrow: 1}} />
                        <Switch checked={privateMode} disabled={updating} onChange={() => setPrivateMode(!privateMode)} />
                      </Stack>
                    </Tooltip>
                    {privateMode && <Stack spacing={2} sx={{py: '0.25em'}}>                      
                      <Divider />
                      <Typography>Trusted Users</Typography>
                      <Grid container direction='row' alignItems={'center'}>
                        <Grid item xs={12} sm={12} md={8} sx={{pt: '0.5em'}}>
                          <TextField fullWidth label='Email' size='small' value={addEmail} disabled={updating} onChange={(e) => {setAddEmail(e.target.value); setError('')}}/>
                        </Grid>
                        <Grid item sx={{flexGrow: 1}} />
                        <Grid item xs={12} sm={12} md={3} sx={{pt: '0.5em'}}>
                          <Button fullWidth variant='contained' size='large' disabled={updating} onClick={handleAddEmail}>Add</Button>
                        </Grid>
                      </Grid>
                      {userList && userList.map((id, index) =>
                        <UserListItem key={index} index={index} id={id} onDelete={() => handleDeleteUser(index)} />
                      )}
                    </Stack>}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button disabled={updating} onClick={handleCloseSettingsDialog}>Cancel</Button>
                <Button variant='contained' color='primary' disabled={updating} onClick={handleUpdateUser}>Update</Button>
            </DialogActions>
        </Dialog>

        <Grid item md={4}>
          <Stack direction='row' alignItems={'center'}>
            <Tooltip title={userData?.displayName}>
              <IconButton
                onClick={handleOpen}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
              <InitializeUser />
              </IconButton>
            </Tooltip>
            <Typography sx={{px: '0.5em', display: {xs: 'none', sm: 'block', md: 'block'}}}>
              {userData?.displayName}
            </Typography>
          </Stack>
          {/* <Typography>{userData?.displayName}</Typography> */}
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
          <MenuItem onClick={() => {router.push('/edit'); handleClose()}}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            My List
          </MenuItem>
          <MenuItem onClick={() => {handleOpenSettingsDialog(); handleClose()}}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={() => {signOut(auth); handleClose()}}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            Sign Out
          </MenuItem>
        </Menu>
      </Grid>
      <Grid item sx={{flexGrow: 1}} />
      {showURL && <Grid item md={6}>
          <TextField fullWidth size='small' value={'https://ic.l2x.us/u/'+user.uid} />
      </Grid>}
    </Grid>
  )
}