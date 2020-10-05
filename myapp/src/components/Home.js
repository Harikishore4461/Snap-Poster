import React, { useState } from "react";
import {Route , Switch ,Link } from 'react-router-dom'
import auth from "./Authcheck";
import Post from './Post'
import Photos from './Photos'
import axios from 'axios'
import "../home.css";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import ImageUploader from 'react-images-upload'
import Avatar from "@material-ui/core/Avatar";
const Home = (props) => {
  const [selectImage,setImage] = useState('https://www.freeiconspng.com/thumbs/person-icon-blue/person-icon-blue-18.png')
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [Open, setOpen] = useState(false);
  const[home,setHome] = useState(true)
   const handleClickOpen = () => () => {
     setOpen(true);
   };

   const handleClose = () => {
     setImage(
       "https://www.freeiconspng.com/thumbs/person-icon-blue/person-icon-blue-18.png"
     );
     setOpen(false);
   };
   const handlePost = () =>{
     let items = {
       username:props.username,
       image: selectImage,
     }
     axios
       .post("http://localhost:4200/home",items)
       .then((res) => {
         console.log("posted");
       })
       .catch((err) => {
         console.log("oops error");
       });
        handleClose();
   }
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const imageUpload = (pic) =>{
    setImage("")
    console.log(pic[0])
        let reader = new FileReader();
        reader.readAsDataURL(pic[0]);
        reader.onload = (e) => {
          setImage(e.target.result);
          e.target.value = null;
        };
  }
  return (
    <div>
      <div>
        <AppBar className="menu__bar" position="static">
          <Toolbar>
            <div className="nav">
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                className="home-person"
              >
                <Avatar src={props.profile} className="home-person1" />
                <p>{props.username}</p>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
                <MenuItem onClick={handleCloseMenu}>My account</MenuItem>
              </Menu>
              {home && (
                <Link to={props.match.url + "/photos"}>
                  <IconButton onClick={() => setHome(false)}>Photos</IconButton>
                </Link>
              )}
              {!home && (
                <Link to={props.match.url + ""}>
                  <IconButton onClick={() => setHome(true)}>Home</IconButton>
                </Link>
              )}
            </div>
            <IconButton onClick={handleClickOpen()} className="iconbutton p-2 m-2">
              <AddAPhotoIcon className="addicon" />
              Post
            </IconButton>
            <IconButton
              onClick={() => {
                auth.authLogout(() => {
                  props.history.push("/");
                });
              }}
              color="primary"
            >
              LogOut
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
      <Dialog
        open={Open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Add Your Post</DialogTitle>
        <DialogContent className="dialogbox" dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            // ref={descriptionElementRef}
            tabIndex={-1}
          ></DialogContentText>
          {/* <AddAPhotoIcon className="addphoto" /> */}
          <img src={selectImage} alt="ok" className="img-thumbnail" />
          <ImageUploader
            withIcon={false}
            buttonText="Add Photo"
            onChange={imageUpload}
            label=""
            imgExtension={[".gif", ".jpg", ".png"]}
            maxFileSize={5242880}
          />
          <label>Add Small Size Image</label>
        </DialogContent>
        <DialogActions>
          <Button className="" onClick={handleClose}>
            Cancel
          </Button>
          <Button autoFocus onClick={handlePost} color="primary">
            Post
          </Button>
        </DialogActions>
      </Dialog>
      <Switch>
        <Route exact path={"/home/"} component={Post} />
        <Route
          exact
          path={props.match.url + "/photos"}
          component={() => <Photos name={props.username} />}
        />
      </Switch>
      {/* <Post /> */}
    </div>
  );
};

export default Home;
 

