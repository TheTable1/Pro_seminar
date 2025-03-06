import { db } from "./firebase";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

export const updateUserAchievement = async (userId, menuId) => {
    try {
      const userRef = doc(db, "users", userId);
      const docSnap = await getDoc(userRef);
  
      if (docSnap.exists()) {
        let data = docSnap.data();
        let achievements = data.achievements || {};
        let progress = data.progress || { totalMenus: 10, completedMenus: 0, completionRate: 0 };
  
        if (!achievements[menuId]) {
          achievements[menuId] = true;
          progress.completedMenus += 1;
          progress.completionRate = Math.round((progress.completedMenus / progress.totalMenus) * 100);
        }
  
        await updateDoc(userRef, { achievements, progress });
      } else {
        await setDoc(userRef, {
          achievements: { [menuId]: true },
          progress: { totalMenus: 10, completedMenus: 1, completionRate: 10 }
        });
      }
  
      console.log(`อัปเดตความสำเร็จของ ${userId} ในเมนู ${menuId} แล้ว`);
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
    }
};

export const getUserAchievements = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const docSnap = await getDoc(userRef);
  
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return { achievements: {}, progress: { totalMenus: 10, completedMenus: 0, completionRate: 0 } };
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงค่าความสำเร็จ:", error);
      return {};
    }
};