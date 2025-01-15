import 'bootstrap/dist/css/bootstrap.min.css';
import background from './assets/background1.jpg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./assets/css/SignUp.css";
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged in as:", userCredential.user.email);
            navigate('/');
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        }

        axios.post('http://localhost:3301/login', { email, password })
            .then(result => {
                console.log(result);
                if (result.data === "success") {
                    navigate('/');
                } else if (result.data === "the password is incorrect") {
                    setErrorMessage("รหัสผ่านไม่ถูกต้อง");
                    setPassword("");
                } else {
                    setErrorMessage("ไม่มีบัญชีผู้ใช้งาน");
                    setEmail("");
                    setPassword("");
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div
            className="container-fluid vh-100 d-flex align-items-center"
            style={{
                backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center',
                zIndex: -1
            }}
        >
            <div className="row w-100">
                <div className="col-12 col-md-6 d-flex flex-column justify-content-center align-items-center">
                    <h2 className="text-white mb-5">Login</h2>
                    <form onSubmit={handleSubmit} className="w-75 ">
                        <div className="form-group mb-3">
                            <input
                                type="email"
                                placeholder="Email"
                                className="form-control border-0 rounded-pill ps-4"
                                style={{
                                    backgroundColor: "rgba(224, 221, 223, 0.5)",
                                    color: 'white',
                                }}
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                            />
                        </div>
                        <style >{`
                                .form-control::placeholder {
                                    color: white; /* กำหนดสีของ placeholder เป็นสีขาว */
                                }
                            `}</style>
                        <div className="form-group mb-4">
                            <input
                                type="password"
                                placeholder="Password"
                                className="form-control border-0 rounded-pill w-100 ps-4"
                                style={{
                                    backgroundColor: "rgba(224, 221, 223, 0.5)",
                                    color: 'white',
                                }}
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                            />
                        </div>
                        {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}
                        <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <button
                                type="submit"
                                className="buttonHover btn btn-light btn-block rounded-pill w-25 "
                            > Login</button>
                        </div>
                    </form>
                    <p className="text-white mt-4 mb-1 ">You don`&apos;`t have an account yet. <Link to="/register" className="text-light ">Register</Link></p>
                    
                </div>
            </div>
        </div>
    );
}

export default Login;
