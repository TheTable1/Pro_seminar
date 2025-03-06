import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebaseConfig";

const auth = getAuth();

/**
 * เข้าสู่ระบบผู้ใช้
 * @param {string} email
 * @param {string} password
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // บันทึก Token ลง Local Storage
    localStorage.setItem("user", JSON.stringify(user));

    console.log("เข้าสู่ระบบสำเร็จ", user);
    return user;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ:", error.message);
    throw error;
  }
};

/**
 * ออกจากระบบ
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("user"); // ลบข้อมูลออกจาก Local Storage
    console.log("ออกจากระบบสำเร็จ");
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการออกจากระบบ:", error.message);
  }
};

/**
 * ตรวจสอบสถานะการล็อกอินเมื่อโหลดแอป
 * @param {function} setUser - ฟังก์ชันอัปเดตสถานะผู้ใช้
 */
export const checkAuthState = (setUser) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user)); // บันทึกลง Local Storage
    } else {
      setUser(null);
      localStorage.removeItem("user"); // ล้างข้อมูลเมื่อออกจากระบบ
    }
  });
};
