import { db } from "./firebase";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

/**
 * อัปเดตค่าความสำเร็จของผู้ใช้ใน Firestore
 * @param {string} userId - ไอดีของผู้ใช้
 * @param {string} menuId - ไอดีของเมนูกาแฟที่ทำสำเร็จ
 */
export const updateUserAchievement = async (userId, menuId) => {
  try {
    console.log(`🟡 กำลังอัปเดตความสำเร็จของ ${userId} ในเมนู ${menuId}`);
    
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      let achievements = data.achievements || {};
      let progress = data.progress || { totalMenus: 5, completedMenus: 0, completionRate: 0 };

      if (!achievements[menuId]) {
        achievements[menuId] = true;
        progress.completedMenus += 1;
        progress.completionRate = Math.round((progress.completedMenus / progress.totalMenus) * 100);
      }

      await updateDoc(userRef, { achievements, progress });
      console.log("✅ อัปเดตข้อมูลเรียบร้อย:", { achievements, progress });

    } else {
      await setDoc(userRef, {
        achievements: { [menuId]: true },
        progress: { totalMenus: 5, completedMenus: 1, completionRate: 20 }
      });

      console.log("✅ สร้างผู้ใช้ใหม่และบันทึกสำเร็จ!");
    }

  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการอัปเดต Firestore:", error);
  }
};
