import 'bootstrap/dist/css/bootstrap.min.css';
import background from './assets/background1.jpg';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./assets/css/SignUp.css";

function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [conPassword, setConPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // ตรวจสอบความตรงกันของรหัสผ่านและการยืนยันรหัสผ่าน
        if (password !== conPassword) {
            setErrorMessage("รหัสผ่านไม่ตรงกัน");
            return;
        }

        // ตรวจสอบเงื่อนไขของรหัสผ่าน: ต้องมีตัวพิมพ์ใหญ่, ตัวพิมพ์เล็ก และตัวเลข
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            setErrorMessage("รหัสผ่านต้องประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก และตัวเลขอย่างน้อย 8 ตัว");
            return;
        }

        // ตรวจสอบว่าอีเมลนี้เคยถูกใช้หรือไม่
        axios.post('http://localhost:3301/check-email', { email })
            .then(response => {
                if (response.data.exists) {
                    setErrorMessage("อีเมลนี้ได้ถูกใช้แล้ว");
                } else {
                    // ถ้าอีเมลนี้ยังไม่ถูกใช้ ให้ดำเนินการสมัครสมาชิกต่อไป
                    axios.post('http://localhost:3301/register', { name, email, password })
                        .then(result => {
                            console.log(result);
                            navigate('/login');
                        })
                        .catch(err => console.log(err));
                }
            })
            .catch(err => {
                console.log(err);
                setErrorMessage("เกิดข้อผิดพลาดในการตรวจสอบอีเมล");
        });

    };


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
                    <h2 className="text-white mb-5">Register</h2>
                    <form onSubmit={handleSubmit} className="w-75">
                        <div className="form-group mb-3">
                            <input
                                type="text"
                                className="form-control border-0 rounded-pill ps-4"
                                placeholder="User Name"
                                style={{
                                    backgroundColor: "rgba(224, 221, 223, 0.5)",
                                    color: 'white',
                                }}
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                required
                            />
                            <style>{`
                                .form-control::placeholder {
                                    color: white; /* กำหนดสีของ placeholder เป็นสีขาว */
                                }
                        
                                button:hover{
                                    background-color: rgba(87,43,27,0.9) ;
                                }
                            `}</style>

                        </div>
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
                        <div className="form-group mb-3">
                            <input
                                type="password"
                                placeholder="Password"
                                className="form-control border-0 rounded-pill ps-4"
                                style={{
                                    backgroundColor: "rgba(224, 221, 223, 0.5)",
                                    color: 'white',
                                }}
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                            />
                        </div>
                        <div className="form-group mb-4">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="form-control border-0 rounded-pill ps-4"
                                style={{
                                    backgroundColor: "rgba(224, 221, 223, 0.5)",
                                    color: 'white',
                                }}
                                onChange={(e) => setConPassword(e.target.value)}
                                value={conPassword}
                                required
                            />
                        </div>
                        {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                                type="submit"
                                className="buttonHover btn btn-light btn-block rounded-pill w-25"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                    <p className="text-white mt-4 mb-1">Already Have an Account? <Link to="/login" className="text-light">Login</Link></p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;