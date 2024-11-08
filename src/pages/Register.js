import { useEffect, useState,useContext } from 'react';
import {Form , Button, Row, Col} from 'react-bootstrap';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from "notyf";

export default function Register() {

    const {user, setUser} = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    const notyf = new Notyf();
    const navigate = useNavigate();

    useEffect(() => {

        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
        } else {
            setPasswordError("");
        }

        if((email !== "" && password !== "" && confirmPassword !== "")) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
        
        console.log(isActive)
    }, [email, password, confirmPassword]);

    function registerUser(e) {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email,
                password
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.message === "Registered Successfully") {
                setEmail('');
                setPassword('');
                setConfirmPassword('');

                notyf.success('Registration Successful');
                navigate('/login');
            } else if (data.error === 'Email invalid') {
                notyf.error('Email is invalid');
            } else if (data.error === 'Password must be at least 8 characters') {
                notyf.error('Password must be at least 8 character');
            } else {
                notyf.error('Something went wrong');
            }
        })
    }

    return(
        user.id !== null ?
        <Navigate to="/login" />
        :
        <>
            <Row className="justify-content-center mt-3">
                <Col xs={10} md={6} lg={6}>
                    <Form onSubmit={(e) => registerUser(e)}>
                        <h1 className='text-center'>Register</h1>
                        <div className="border p-4 mt-5 mx-auto">
                            <Form.Group>
                                <Form.Label>Email:</Form.Label>
                                <Form.Control type='text' placeholder='Enter your email' required value={email} onChange={e => {setEmail(e.target.value)}}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password:</Form.Label>
                                <Form.Control type='password' placeholder='Enter your password' required value={password} onChange={e => {setPassword(e.target.value)}}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Verify Password:</Form.Label>
                                <Form.Control type='password' placeholder='Verify your password' required value={confirmPassword} onChange={e => {setConfirmPassword(e.target.value)}}/>
                            </Form.Group>
                        </div>
                        <div className="mt-3">
                            {
                                isActive ?
                                <Button variant="primary" type="submit" id='submitBtn' className="w-100">Submit</Button>
                                :
                                <Button variant="danger" type="submit" id='submitBtn' className="w-100" disabled>Please enter your registration details</Button>
                            }
                        </div>
                        
                    </Form>
                </Col>
            </Row>
            <div className="mt-3 text-center">
                <p>
                    Already have an account?{' '}
                    <Link to="/login">Click here</Link>
                    {' '}to login.
                </p>
            </div>
        </>
    )
}