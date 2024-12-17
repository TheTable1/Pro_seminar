import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";

// MenuCard component
const MenuCard = ({ menu }) => (
  <div style={{ textAlign: "center", padding: "20px" }}>
    <img src={menu.image || menu.img} alt={menu.name} style={{ width: "200px", height: "auto" }} />
    <h2>{menu.name}</h2>
    <p>{menu.description}</p>
  </div>
);

MenuCard.propTypes = {
  menu: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
    img: PropTypes.string,
  }).isRequired,
};

// FinalStep component
const FinalStep = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    if (location.state) {
      setMenu(location.state); // รับข้อมูลเมนูจาก state
    }
  }, [location.state]);

  const handleRestart = () => {
    navigate("/"); // กลับไปยังหน้าหลัก
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {menu ? (
        <>
          <h1>การทำ {menu.name} เสร็จสิ้น!</h1>
          <MenuCard menu={menu} />
          <button
            onClick={handleRestart}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            ทำใหม่อีกครั้ง
          </button>
        </>
      ) : (
        <h1>ไม่พบเมนูที่คุณเพิ่งทำเสร็จ</h1>
      )}
    </div>
  );
};

export default FinalStep;


  