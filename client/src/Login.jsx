import "bootstrap-icons/font/bootstrap-icons.css";
import background from './assets/background1.jpg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/css/SignUp.css';

import { auth, db } from './firebase/firebase';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

function Auth() {
  const [mode, setMode] = useState('login'); // แค่สตริงธรรมดา

  // ----- login form state -----
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);

  // ----- sign-up form state -----
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPw, setRegPw] = useState('');
  const [regPw2, setRegPw2] = useState('');
  const [showRegPw, setShowRegPw] = useState(false);
  const [showRegPw2, setShowRegPw2] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // -------------------- LOGIN --------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, loginEmail, loginPw);
      // เก็บ user ลง Firestore/อัปเดตเวลาเข้าสู่ระบบ
      await setDoc(
        doc(db, 'users', user.uid),
        { email: user.email, lastLogin: new Date() },
        { merge: true }
      );
      navigate('/');
    } catch (err) {
      console.error(err);
      setErrorMessage('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setSubmitting(false);
    }
  };

  const loginWithGoogle = async () => {
    setErrorMessage('');
    setSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      await setDoc(
        doc(db, 'users', user.uid),
        {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          lastLogin: new Date(),
        },
        { merge: true }
      );
      navigate('/');
    } catch (err) {
      console.error(err);
      setErrorMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google');
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------- SIGN UP --------------------
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (regPw !== regPw2) {
      setErrorMessage('รหัสผ่านไม่ตรงกัน');
      return;
    }
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!strong.test(regPw)) {
      setErrorMessage('รหัสผ่านต้องมี ตัวพิมพ์ใหญ่/เล็ก และตัวเลข อย่างน้อย 8 ตัว');
      return;
    }

    setSubmitting(true);
    try {
      const methods = await fetchSignInMethodsForEmail(auth, regEmail);
      if (methods.length > 0) {
        setErrorMessage('อีเมลนี้ได้ถูกใช้แล้ว');
        setSubmitting(false);
        return;
      }

      const { user } = await createUserWithEmailAndPassword(auth, regEmail, regPw);
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email: regEmail,
        createdAt: new Date(),
      });

      // สมัครสำเร็จ → สลับไปโหมด Sign In
      setMode('login');
      setErrorMessage('');
      setLoginEmail(regEmail); // auto-fill อีเมลให้ช่องล็อกอิน
      setLoginPw('');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-email') setErrorMessage('อีเมลไม่ถูกต้อง');
      else if (err.code === 'auth/weak-password') setErrorMessage('รหัสผ่านอ่อนเกินไป');
      else setErrorMessage('เกิดข้อผิดพลาดในการสมัครสมาชิก');
    } finally {
      setSubmitting(false);
    }
  };

  const switchTo = (target) => {
    setMode(target);
    setErrorMessage('');
  };

  return (
    <div
      className="auth-shell"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="auth-overlay" />

      {/* container แบบสไลด์ */}
      <div className={`auth-slider ${mode === 'signup' ? 'right-active' : ''}`}>
        {/* ------- Sign In panel ------- */}
        <section className="pane sign-in-pane">
          <h1 className="title">Sign In</h1>

          <div className="social-row">
            <button type="button" className="social-btn" onClick={loginWithGoogle} title="Sign in with Google">
              <img src="/Google.webp" alt="Google" className="g-icon" />
            </button>
            <button type="button" className="social-btn" aria-disabled title="Demo">
              <i className="bi bi-facebook" />
            </button>
            <button type="button" className="social-btn" aria-disabled title="Demo">
              <i className="bi bi-github" />
            </button>
            <button type="button" className="social-btn" aria-disabled title="Demo">
              <i className="bi bi-linkedin" />
            </button>
          </div>

          <span className="hint">or use your email password</span>

          <form onSubmit={handleLogin} className="auth-form">
            <input
              type="email"
              className="input"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <div className="pw-wrap">
              <input
                type={showLoginPw ? 'text' : 'password'}
                className="input pw"
                placeholder="Password"
                value={loginPw}
                onChange={(e) => setLoginPw(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowLoginPw((s) => !s)}
                aria-label={showLoginPw ? 'Hide password' : 'Show password'}
              >
                {showLoginPw ? '🙈' : '👁️'}
              </button>
            </div>

            {errorMessage && mode === 'login' && (
              <div className="error" role="alert">{errorMessage}</div>
            )}

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting && mode === 'login' ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </section>

        {/* ------- Sign Up panel ------- */}
        <section className="pane sign-up-pane">
          <h1 className="title">Create Account</h1>

          <div className="social-row">
            <button type="button" className="social-btn" onClick={loginWithGoogle} title="Continue with Google">
              <img src="/Google.webp" alt="Google" className="g-icon" />
            </button>
            <button type="button" className="social-btn" aria-disabled title="Demo">
              <i className="bi bi-facebook" />
            </button>
            <button type="button" className="social-btn" aria-disabled title="Demo">
              <i className="bi bi-github" />
            </button>
            <button type="button" className="social-btn" aria-disabled title="Demo">
              <i className="bi bi-linkedin" />
            </button>
          </div>

          <span className="hint">or use your email for registration</span>

          <form onSubmit={handleRegister} className="auth-form">
            <input
              type="text"
              className="input"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
            <input
              type="email"
              className="input"
              placeholder="Email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <div className="pw-wrap">
              <input
                type={showRegPw ? 'text' : 'password'}
                className="input pw"
                placeholder="Password"
                value={regPw}
                onChange={(e) => setRegPw(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowRegPw((s) => !s)}
                aria-label={showRegPw ? 'Hide password' : 'Show password'}
              >
                {showRegPw ? '🙈' : '👁️'}
              </button>
            </div>
            <div className="pw-wrap">
              <input
                type={showRegPw2 ? 'text' : 'password'}
                className="input pw"
                placeholder="Confirm password"
                value={regPw2}
                onChange={(e) => setRegPw2(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowRegPw2((s) => !s)}
                aria-label={showRegPw2 ? 'Hide password' : 'Show password'}
              >
                {showRegPw2 ? '🙈' : '👁️'}
              </button>
            </div>

            {errorMessage && mode === 'signup' && (
              <div className="error" role="alert">{errorMessage}</div>
            )}

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting && mode === 'signup' ? 'Creating…' : 'Sign Up'}
            </button>
          </form>
        </section>

        {/* ------- Overlay that slides ------- */}
        <aside className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h2>Welcome Back!</h2>
              <p>To keep connected with us please login with your personal info</p>
              <button className="btn-ghost" onClick={() => switchTo('login')}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h2>Hello, Friend!</h2>
              <p>Register with your personal details to use all of our site features</p>
              <button className="btn-ghost" onClick={() => switchTo('signup')}>Sign Up</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Auth;
