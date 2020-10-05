class auth {
  constructor(props) {
    this.state = {
      authenticate: true,
    };
  }
  authLogin(cb) {
    this.state.authenticate = true;
    cb()
  }
  authLogout(cb) {
    this.state.authenticate = false;
    cb();
  }
  isAuthenticated() {
    return this.state.authenticate;
  }
}
export default new auth();
