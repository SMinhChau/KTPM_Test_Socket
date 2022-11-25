import react, { useState } from "react";
import { connect } from "react-redux";
import { authenticate, authFailure, authSuccess } from "../redux/authActions";
import "./loginpage.css";
import { userLogin } from "../api/authenticationService";
import { Alert, Spinner } from "react-bootstrap";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { setAuthToken } from "../api/useToken";

const LoginPage = ({ loading, error, ...props }) => {
  const [values, setValues] = useState({
    phoneNumber: "",
    password: "",
  });

  //   Connect Socket
  const onError = (error) => {
    console.log("Could not connect" + error);
  };

  const onConnected = () => {
    console.log(" ======== connected ==========: ");
    // stompClient.subscribe(`/user/6369be7ddddc35319a17cd28/chat`);

    stompClient.subscribe(`/user/6369be7ddddc35319a17cd28`);
    stompClient.send(
      "/app/chat.addUser",
      {},
      JSON.stringify({ sender: "6369be7ddddc35319a17cd28", type: "JOIN" })
    );
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    props.authenticate();

    var sock = new SockJS(`https://ktpm-server.herokuapp.com/ws`);
    global.stompClient = Stomp.over(sock);

    console.log(" ======== stompClient.connect ==========: ");
    global.stompClient.connect(onError, onConnected);

    userLogin(values)
      .then((response) => {
        console.log("response", response);

        // console.log("token", response.data.accessToken);
        //set JWT token to local
        const token = response.data.data.accessToken;
        // localStorage.setItem("token", token);
        console.log("token", token);
        //set token to axios common header
        setAuthToken(token);
        if (response.status === 200) {
          props.setUser(response.data);
          props.history.push("/dashboard");
        } else {
          props.loginFailure("Something Wrong!Please Try Again");
        }
      })
      .catch((err) => {
        if (err && err.response) {
          switch (err.response.status) {
            case 401:
              console.log("401 status");
              props.loginFailure("Authentication Failed.Bad Credentials");
              break;
            default:
              props.loginFailure("Something Wrong!Please Try Again");
          }
        } else {
          props.loginFailure("Something Wrong!Please Try Again");
        }
      });
    //console.log("Loading again",loading);
  };

  const handleChange = (e) => {
    e.persist();
    setValues((values) => ({
      ...values,
      [e.target.name]: e.target.value,
    }));
  };

  console.log("Loading ", loading);

  return (
    <div className="login-page">
      <section className="h-100">
        <div className="container h-100">
          <div className="row justify-content-md-center h-100">
            <div className="card-wrapper">
              <div className="card fat">
                <div className="card-body">
                  <h4 className="card-title">Login</h4>

                  <form
                    className="my-login-validation"
                    onSubmit={handleSubmit}
                    noValidate={false}
                  >
                    <div className="form-group">
                      <label htmlFor="email">User Name</label>
                      <input
                        id="phoneNumber"
                        type="text"
                        className="form-control"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        name="phoneNumber"
                        required
                      />

                      <div className="invalid-feedback">UserId is invalid</div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        id="password"
                        type="password"
                        className="form-control"
                        value={values.password}
                        onChange={handleChange}
                        name="password"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="customCheck1"
                        />
                      </div>
                    </div>

                    <div className="form-group m-0">
                      <button type="submit" className="btn btn-primary">
                        Login
                        {loading && (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </div>
                  </form>
                  {error && (
                    <Alert style={{ marginTop: "20px" }} variant="danger">
                      {error}
                    </Alert>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const mapStateToProps = ({ auth }) => {
  console.log("state ", auth);
  return {
    loading: auth.loading,
    error: auth.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    authenticate: () => dispatch(authenticate()),
    setUser: (data) => dispatch(authSuccess(data)),
    loginFailure: (message) => dispatch(authFailure(message)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
