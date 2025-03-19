import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

/**
 * อัปเดตค่าความสำเร็จของผู้ใช้ใน Firestore (แบ่งเป็น 3 หมวดหมู่: simulator, content, knowledge)
 * หากผู้ใช้ยังไม่มี Document หรือ achievements เลย จะกำหนดค่าเริ่มต้นให้
 *
 * @param {string} userId - UID ของผู้ใช้
 * @param {string} category - หมวดหมู่ ("simulator", "content", "knowledge")
 * @param {string} achievementId - เช่น "espresso", "history_coffee"
 * @param {boolean} status - true = สำเร็จ
 */
export async function updateUserAchievement(userId, category, achievementId, status = true) {
  if (!userId) {
    console.error("❌ ไม่มี userId ไม่สามารถบันทึกได้");
    return;
  }

  try {
    console.log(`🟡 Updating user=${userId}, category=${category}, achievement=${achievementId}`);

    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // 🔹 ถ้าไม่มี Document ผู้ใช้อยู่เลย สร้าง Document ใหม่พร้อมโครงสร้างเริ่มต้น
      let achievements = {
        simulator: {},
        content: {},
        knowledge: {}
      };

      achievements[category][achievementId] = status;

      await setDoc(userRef, { achievements });
      console.log("✅ สร้าง user doc ใหม่และบันทึก achievements:", achievements);

    } else {
      // 🔹 ถ้ามี Document อยู่แล้ว
      let data = docSnap.data();
      let achievements = data.achievements;

      // ถ้า achievements ยังไม่มี หรือเป็น null/undefined ให้กำหนดค่าเริ่มต้น
      if (!achievements) {
        achievements = {
          simulator: {},
          content: {},
          knowledge: {}
        };
      }

      // ถ้า category ยังไม่มี ก็สร้าง object เปล่า
      if (!achievements[category]) {
        achievements[category] = {};
      }

      achievements[category][achievementId] = status;

      await updateDoc(userRef, { achievements });
      console.log("✅ อัปเดตความสำเร็จเรียบร้อย:", achievements);
    }

  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาด:", error);
  }
}
