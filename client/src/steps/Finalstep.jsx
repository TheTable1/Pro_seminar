import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Example coffee menu list
const coffeeMenus = [
  { name: "เอสเปรสโซ", description: "กาแฟดำเข้มข้น", image: "espresso.jpg" },
  { name: "อเมริกาโน่", description: "กาแฟดำผสมน้ำร้อน", image: "americano.jpg" },
  { name: "ลาเต้", description: "กาแฟผสมนมเนื้อเนียน", image: "latte.jpg" },
  { name: "คาปูชิโน", description: "กาแฟกับฟองนมนุ่ม", image: "cappuccino.jpg" },
  { name: "มัคคิอาโต้", description: "กาแฟที่มีฟองนมเล็กน้อย", image: "macchiato.jpg" },
];

// MenuCard component displays each coffee menu with image and description
const MenuCard = ({ menu }) => (
  <div style={{ textAlign: "center", padding: "20px" }}>
    <img src={menu.image} alt={menu.name} style={{ width: "200px", height: "auto" }} />
    <h2>{menu.name}</h2>
    <p>{menu.description}</p>
  </div>
);

MenuCard.propTypes = {
  menu: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

// FinalStep component for displaying the result of the selected coffee menu
const FinalStep = ({ initialMenuName, onRestart }) => {
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    if (initialMenuName) {
      const matchedMenu = coffeeMenus.find((menu) => menu.name === initialMenuName);
      setMenu(matchedMenu || null);
    }
  }, [initialMenuName]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {menu ? (
        <>
          <h1>การทำ {menu.name} เสร็จสิ้น!</h1>
          <MenuCard menu={menu} />
          <button onClick={onRestart} style={{ marginTop: "20px", padding: "10px 20px" }}>
            ทำใหม่อีกครั้ง
          </button>
        </>
      ) : (
        <h1>ไม่พบเมนูที่คุณเพิ่งทำเสร็จ</h1>
      )}
    </div>
  );
};

FinalStep.propTypes = {
  initialMenuName: PropTypes.string.isRequired,
  onRestart: PropTypes.func.isRequired,
};

export default FinalStep;


  