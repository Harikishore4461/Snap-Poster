import React,{useState} from 'react'
import Alert from "@material-ui/lab/Alert";
import {Link} from 'react-router-dom'
import '../Login.css'
import auth from './Authcheck'
import {useFormik} from 'formik'
import axios from 'axios'
import GoogleLogin from "react-google-login";
import Snackbar from "@material-ui/core/Snackbar";
const Login = (props) => {
    // console.log(props)
    const responseGoogle = res =>{
        console.log(res.profileObj)
        props.userInfo({username:res.profileObj.name,profile:res.profileObj.imageUrl});
        axios.post("http://localhost:4200/google", {
          email: res.profileObj.email,
          username: res.profileObj.name,
          profile:res.profileObj.imageUrl})
          .then(res=>{console.log(res)
           auth.authLogin(() => {
             props.history.push("/home");
           });
          })
          .catch(err=>console.log(err))
          
    }
    const responseFailure = (res) =>{
        setAlert("Oops Fail to Signin")
    }
    // useState for Disabling 
    const [disable,setDisable] = useState(true)
    // Authentication alert 
    const [alert,setAlert] = useState('')
    //formik 
    const initialValues = {
        email :"",
        password:""
    }
    const validate = values =>{
        let errors = {}
        if(values.email.trim() && values.password.trim()){
            setDisable(false)
        }
        else{
            setDisable(true)
        }
        // if(!values.email.endsWith('@gmail.com')){
        //   errors.email = "Enter a Valid Mail Address"
        //     setDisable(true);
        // }
        // if(values.password.length<6){
        //   errors.password = "Password must have atleast 6 characters"
        //    setDisable(true);
        // }
        return errors
    }
    const onSubmit = values =>{
        // Here we send user credentials for authentication
          axios
            .post("http://localhost:4200/signin", values)
            .then((res) => {
              console.log(res)
              props.userInfo({username:res.data.username,profile:res.data.profile});
              auth.authLogin(() => {
                props.history.push("/home");
              });
            })
            .catch((err) => {
              console.log(err);
              if(err.response.data){
              setAlert(err.response.data);
              }
            });
    }
    const formik = useFormik({
        initialValues,
        onSubmit,
        validate
    })
    return (
      <div className="login">
        <div className="block">
          <h1 className="head">LOG IN HERE!</h1>
          <h1 className="reflection">LOG IN HERE!</h1>
        </div>
        <div className="card">
          {/* alert */}
          {alert ? (
            <Snackbar
              open={true}
              autoHideDuration={6000}
              onClose={() => setAlert("")}
              className="alert"
            >
              <Alert severity="error" onClose={() => setAlert("")}>
                {alert}
              </Alert>
            </Snackbar>
          ) : null}

          <div className="card-body">
            <div className="form-group">
              <form onSubmit={formik.handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
                  autoFocus
                  type="email"
                  className={`form-control ${
                    formik.touched.email && formik.errors.email
                      ? `is-invalid`
                      : null
                  }`}
                  name="email"
                  id="email"
                  {...formik.getFieldProps("email")}
                  aria-describedby="helpId"
                  placeholder="name@example.com"
                />
                {formik.errors.email && formik.touched.email ? (
                  <div className="text-danger">{formik.errors.email}</div>
                ) : null}
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className={`form-control ${
                    formik.touched.password && formik.errors.password
                      ? `is-invalid`
                      : null
                  }`}
                  name="password"
                  id="password"
                  {...formik.getFieldProps("password")}
                  aria-describedby="helpId"
                  placeholder="Enter Password"
                />
                {formik.errors.password && formik.touched.password ? (
                  <div className="text-danger">{formik.errors.password}</div>
                ) : null}
                <button type="submit" disabled={disable} className="btn-grad">
                  SIGN IN
                </button>
                <div className="singinwith">
                  <div className="or__option">
                    <hr />
                    <h6> OR</h6>
                    <hr />
                  </div>
                  <div className="googleSigin"></div>
                  <GoogleLogin
                    clientId="855194221650-a7qeu2v35jo2vrlghvp92jqcjlifs098.apps.googleusercontent.com"
                    className="btn btn-primary btn-lg btn-block"
                    buttonText="SIGN IN WITH GOOGLE"
                    onSuccess={responseGoogle}
                    onFailure={responseFailure}
                    cookiePolicy={"single_host_origin"}
                  />
                </div>
              </form>
            </div>
            <div className="card-footer">
              <div>
                <p>
                  New User
                  <Link to="/signup"> Sign Up</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Login
