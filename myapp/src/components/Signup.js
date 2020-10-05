import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import {useFormik} from 'formik'
import axios from 'axios'
import GoogleLogin from "react-google-login";
import auth from './Authcheck'
const Signup = (props) => {
      const responseGoogle = (res) => {
        console.log(res.profileObj.name);
        props.userInfo({username:res.profileObj.name,profile:res.profileObj.imageUrl});
           auth.authLogin(() => {
             props.history.push("/home");
           });
      };
      // useState for Disabling
      const [disable, setDisable] = useState(true);
      // Authentication alert
      const [alert, setAlert] = useState("");
      //formik
      const initialValues = {
        email: "",
        username:"",
        password: "",
        confirmpassword:""
      };
      const validate = (values) => {
        const errors = {};
        if (values.email.trim() && values.password.trim()) {
          setDisable(false);
        } else {
          setDisable(true);
        }
        if(values.password.length<6){
          errors.password = "password must contain atleast 6 characters"
           setDisable(true);

        }
        if(values.password!==values.confirmpassword){
           errors.confirmpassword="Password Does not match"
           setDisable(true);
        }
        return errors;
      };
      const onSubmit = (values) => {
        console.log(values);

        // Here we send user credentials for authentication
        axios
          .post("http://localhost:4200/signup", values)
          .then((res) => {
            console.log(res)
            props.history.push('/')
          })
          .catch((err) => {
            console.log(err.response)
            setAlert(err.response.data.message);
          });
      };
      const formik = useFormik({
        initialValues,
        onSubmit,
        validate,
      });
    return (
      <div className="login">
        <div className="card1">
          {/* alert */}
          {alert ? (
            <Snackbar
              open={true}
              autoHideDuration={6000}
              onClose={() => setAlert("")}
              className="alert1"
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
                <label htmlFor="username">Username</label>
                <input
                  type="username"
                  className={`form-control ${
                    formik.touched.username && formik.errors.username
                      ? `is-invalid`
                      : null
                  }`}
                  name="username"
                  id="username"
                  {...formik.getFieldProps("username")}
                  aria-describedby="helpId"
                  placeholder="username"
                />

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
                {formik.touched.password &&
                formik.errors.password ? (
                  <div className="text-danger">
                    {formik.errors.password}
                  </div>
                ) : null}
                <label htmlFor="confirmpassword">Confirm Password</label>
                <input
                  type="password"
                  className={`form-control ${
                    formik.touched.confirmpassword &&
                    formik.errors.confirmpassword
                      ? `is-invalid`
                      : null
                  }`}
                  name="confirmpassword"
                  id="confirmpassword"
                  {...formik.getFieldProps("confirmpassword")}
                  aria-describedby="helpId"
                  placeholder="Re-enter Password"
                />
                {formik.touched.confirmpassword &&
                formik.errors.confirmpassword ? (
                  <div className="text-danger">
                    {formik.errors.confirmpassword}
                  </div>
                ) : null}
                <button type="submit" disabled={disable} className="btn-grad">
                  SIGN UP
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
                    onFailure={responseGoogle}
                    cookiePolicy={"single_host_origin"}
                  />
                </div>
              </form>
            </div>
            <div className="card-footer">
              <div>
                <p>
                  Already Have an Account
                  <Link to="/"> Sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Signup
