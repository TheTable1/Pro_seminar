import PropTypes from "prop-types";

const CoffeeBeanSelection = ({ onStepComplete }) => {
  const coffeeBeans = [
    { id: 1, name: "อาราบิก้า", description: "(นุ่มละมุน และ รสชาติเข้มข้นกลมกล่อม)", image: "/gene/gene1.jpg" },
    { id: 2, name: "โรบัสต้า", description: "(เข้มข้น และ รสชาติดุดัน)", image: "/gene/gene2.jpg" },
    { id: 3, name: "ลิเบริกา", description: "(โดดเด่น และ มีกลิ่นผลไม้)", image: "/gene/gene3.jpg" },
    { id: 4, name: "เอ็กเซลซ่า", description: "(ซับซ้อน และ เปรี้ยวสดชื่น)", image: "/gene/gene4.jpg" },
  ];

  const handleSelectBean = (bean) => {
    onStepComplete(bean); // ส่งเมล็ดกาแฟที่เลือกไปยังขั้นตอนถัดไปทันที
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>เลือกเมล็ดกาแฟ</h2>
      <div
        className="bean-selector"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflowX: "auto",
          paddingBottom: "20px",
          marginTop: "140px",
          paddingTop: "20px",
        }}
      >
        {coffeeBeans.map((bean) => (
          <div
            className="beans"
            key={bean.id}
            onClick={() => handleSelectBean(bean)}
            style={{
              border: "1px solid gray",
              padding: "10px",
              margin: "0 20px",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "transform 0.3s ease-in-out, box-shadow 0.3s",
              textAlign: "center",
              flexShrink: 0,
              width: "180px",
              height: "250px",
              backgroundColor: "#fff",
            }}
          >
            <img
              src={bean.image}
              alt={bean.name}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "10px 10px 0 0",
              }}
            />
            <h3>{bean.name}</h3>
            <p>{bean.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

CoffeeBeanSelection.propTypes = {
  onStepComplete: PropTypes.func.isRequired,
};

export default CoffeeBeanSelection;





  