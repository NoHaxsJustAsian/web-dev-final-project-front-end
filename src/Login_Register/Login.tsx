import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";

function AuthScreen() {
    const nav = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [passwordShown, setPasswordShown] = useState(false);

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    const handleAuth = (user: any) => {
      const endpoint = isLogin ? "users/login" : "users/register";
      axios
        .post(url + endpoint, user)
        .then((res) => {
          console.log(res);
          if (isLogin) {
            const id = res.data._id.toString();
            nav("/feed/" + id);
          } else {
            setIsLogin(true); // Switch to login after successful registration
          }
        })
        .catch((err) => console.log(err));
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleAuth({ email, password, firstName, lastName });
    };

    const toggleForm = () => {
      setIsLogin(!isLogin);
    };

    return (
        <div className="auth-screen">
            <div className="Container">
                <header className="Header">Log in</header>
                <hr />
                <Form onSubmit={onSubmit}>
                    {isLogin || (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="First Name"
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Last Name"
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </Form.Group>
                        </>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <InputGroup className="mb-3">
                        <Form.Control
                            type={passwordShown ? "text" : "password"}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button variant="outline-secondary" onClick={togglePassword}>
                            <i className={passwordShown ? "fas fa-eye-slash" : "fas fa-eye"} />
                        </Button>
                    </InputGroup>
                    <Button type="submit">
                        {isLogin ? "Login" : "Register"}
                    </Button>
                </Form>
                <div className="SwitchLoginCreateGroup">
                    <p>{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
                    <Button onClick={toggleForm}>
                        {isLogin ? "Register" : "Login"}
                    </Button>
                </div>
            </div>
            <div className="bg-danger">
                <img src={backdrop} className="object-cover" alt="Backdrop" />
            </div>
        </div>
    );
}

export default AuthScreen;
