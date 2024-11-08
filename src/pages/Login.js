import { useEffect, useState, useContext } from 'react';
import {Form , Button, Row, Col} from 'react-bootstrap';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from "notyf";

export default function Login() {

    const {user, setUser} = useContext(UserContext);

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [buttonEnabled, setButtonEnabled] = useState(false)

    const notyf = new Notyf();

    const navigate = useNavigate();

    useEffect(() => {
        if (email && password) {
            setButtonEnabled(true)
        }
        else {
            setButtonEnabled(false)
        }
    }, [email, password]);

    function authenticate(e) {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email,
                password
            })
        })
        .then(res => res.json())
        .then(data => {
            
            if (data.access !== undefined) {
                localStorage.setItem("token", data.access);
                retrieveUserDetails(data.access);

                console.log("token", data.access);
                notyf.success("Thank you for logging in.");
            } else if (data.error === "Email and password do not match") {
                notyf.error("Incorrect email or password.");
            } else if (data.error === "No email found") {
                notyf.error("Email does not exist.");
            } else {
                notyf.error("Something went wrong");
            }

        })
    }

    function retrieveUserDetails(accessToken) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
            headers: {Authorization: `Bearer ${accessToken}`}
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setUser({
                id: data.user._id
            });
            navigate('/workouts');
        })


    }

    return (
        user.id !== null ?
        <Navigate to="/workouts" />
        :
        <>
            <Row className="justify-content-center mt-3">
                <Col xs={10} md={6} lg={6}>
                    <Form onSubmit={(e) => authenticate(e)}>
                        <h1 className='text-center'>Log in</h1>
                        <div className="border p-4 mt-5 mx-auto">
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </Form.Group>
                        </div>
                        <div className="mt-3">
                            {
                                buttonEnabled ?
                                <Button variant="primary" type="submit" id='submitFeedbackBtn' className="w-100">Submit</Button>
                                :
                                <Button variant="danger" type="submit" id='submitFeedbackBtn' className="w-100"disabled>Submit</Button>
                            }
                        </div>
                    </Form>

                    
                </Col>
            </Row>
            <div className="mt-3 text-center">
                <p>
                    Don't have an account yet?{' '}
                    <Link to="/register">Click here</Link>
                    {' '}to register.
                </p>
            </div>
        </>
    );
}