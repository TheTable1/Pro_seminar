import { useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";

const CoffeeVariety = () => {
  const [selectedVariety, setSelectedVariety] = useState("Arabica");
  const [selectedSubVariety, setSelectedSubVariety] = useState("");

  const coffeeData = {
    Arabica: {
      title: "Arabica",
      description:
        "อาราบิก้าเป็นสายพันธุ์กาแฟที่มีความสำคัญมากที่สุดในอุตสาหกรรมกาแฟ โดยประมาณ 60-70% ของกาแฟที่ผลิตและบริโภคทั่วโลกมาจากสายพันธุ์อาราบิก้านี้ เป็นพันธุ์ที่ปลูกในประเทศที่มีอากาศเย็น โดยเฉพาะในพื้นที่สูง มักปลูกที่ความสูง 1,000-2,000 เมตรเหนือระดับน้ำทะเล มีรสชาติที่นุ่มนวลและกลมกล่อม มีกลิ่นหอมที่โดดเด่น และมีกรดที่ดี ทำให้มีรสชาติที่ซับซ้อนและละเอียดอ่อน เหมาะสำหรับการทำกาแฟพิเศษ (Specialty Coffee) นอกจากนี้ยังเป็นกาแฟที่มีคาเฟอีนต่ำกว่า Robusta จึงเหมาะสำหรับผู้ที่ต้องการดื่มกาแฟที่ไม่เข้มจนเกินไป พื้นที่ปลูกหลักๆ ได้แก่ เอธิโอเปีย บราซิล โคลอมเบีย และหลายประเทศในเอเชียตะวันออกเฉียงใต้ เช่น เวียดนาม และอินโดนีเซีย",
      subVarieties: [
        {
          name: "Typica",
          description: "Typica เป็นสายพันธุ์ดั้งเดิมของอาราบิก้า ให้รสชาตินุ่มนวล หอม และมีความซับซ้อน มักพบในพื้นที่ปลูกกาแฟเก่าแก่ เช่น เอธิโอเปีย และลาตินอเมริกา แม้ว่าจะให้ผลผลิตต่ำ แต่คุณภาพของกาแฟที่ได้ถือว่ายอดเยี่ยม"
        },
        {
          name: "Bourbon",
          description: "Bourbon เป็นสายพันธุ์ที่พัฒนามาจาก Typica ให้รสชาติหวาน กลิ่นหอมซับซ้อน และมีบอดี้ปานกลาง นิยมปลูกในประเทศแถบละตินอเมริกา เช่น บราซิล เอลซัลวาดอร์ และกัวเตมาลา"
        },
        {
          name: "Caturra",
          description: "Caturra เป็นสายพันธุ์กลายพันธุ์จาก Bourbon ที่ค้นพบในบราซิล มีจุดเด่นที่ให้ผลผลิตสูง ทนทานต่อสภาพอากาศ และมีรสชาติที่ซับซ้อน มักปลูกในพื้นที่สูงของอเมริกาใต้"
        },
        {
          name: "Geisha",
          description: "Geisha เป็นหนึ่งในสายพันธุ์อาราบิก้าที่มีชื่อเสียงมากที่สุด มีกลิ่นหอมเฉพาะตัวคล้ายมะลิและผลไม้ ให้รสชาติที่มีความเปรี้ยวและหวาน มีความซับซ้อนสูง นิยมปลูกในปานามา เอธิโอเปีย และประเทศอื่นๆ ที่มีพื้นที่สูง",
        },
      ],
      image: "/gene/gene1.jpg",
    },
    Robusta: {
      title: "Robusta",
      description:
        "โรบัสต้าเป็นสายพันธุ์กาแฟที่ปลูกในเขตร้อนชื้น มีคาเฟอีนสูงกว่าสายพันธุ์อาราบิก้า โดยมีคาเฟอีนประมาณ 2-2.7% เมื่อเทียบกับอาราบิก้าที่มีคาเฟอีนเพียง 1-1.5% รสชาติของโรบัสต้าจะมีความขมเข้มข้น กลิ่นดิน และมีบอดี้หนัก นิยมใช้ในการผลิตกาแฟสำเร็จรูปและกาแฟเอสเปรสโซ เพราะให้ความเข้มข้นที่โดดเด่นและครีม่า (Crema) ที่หนา พื้นที่ปลูกหลักๆ ได้แก่ เวียดนาม บราซิล และประเทศในแอฟริกา เช่น ยูกันดา",
      subVarieties: [
        {
          name: "Robusta 11",
          description: "Robusta 11 เป็นสายพันธุ์ที่มีความทนทานต่อโรคสูง ให้รสชาติขมเข้ม นิยมใช้ในกาแฟสำเร็จรูปและกาแฟผสมที่ต้องการเพิ่มความเข้มข้น"
        },
        {
          name: "Conillon",
          description: "Conillon เป็นสายพันธุ์โรบัสต้าที่ปลูกมากในบราซิล มีรสชาติเข้ม กลิ่นดินเล็กน้อย และมีความทนทานต่อสภาพอากาศร้อน เหมาะสำหรับการผลิตกาแฟปริมาณมาก"
        },
        {
          name: "SL28",
          description: "SL28 เป็นพันธุ์ที่พัฒนาขึ้นในเคนยา แม้จะเป็นพันธุ์หลักของอาราบิก้า แต่ในบางพื้นที่มีการปลูกโรบัสต้าที่มีลักษณะคล้าย SL28 เพื่อให้ได้กาแฟที่มีรสชาติซับซ้อนและทนทานต่อโรค"
        },
      ],
      image: "/gene/gene2.jpg",
    },
    Liberica: {
      title: "Liberica",
      description:
        "ลิเบอริก้าเป็นสายพันธุ์กาแฟที่มีลักษณะเฉพาะ เมล็ดมีขนาดใหญ่และรูปทรงยาว ปลูกในพื้นที่เขตร้อน มีกลิ่นหอมที่เป็นเอกลักษณ์ รสชาติออกควัน มีความฝาดเล็กน้อย และความเปรี้ยวต่ำ เนื่องจากให้ผลผลิตต่ำและเติบโตได้ยาก จึงไม่ค่อยแพร่หลาย พบการปลูกมากในฟิลิปปินส์ มาเลเซีย และอินโดนีเซีย",
      subVarieties: [
        {
          name: "Excelsa",
          description: "Excelsa เป็นสายพันธุ์ย่อยของ Liberica ที่มีกลิ่นหอมเฉพาะตัว รสชาติเปรี้ยวหวาน นิยมใช้ในการผสมกาแฟเพื่อเพิ่มความซับซ้อนของรสชาติ"
        },
        {
          name: "Liberica 24",
          description: "Liberica 24 เป็นสายพันธุ์ที่ให้กลิ่นหอมยาวนาน รสชาติออกควันและฝาดเล็กน้อย นิยมปลูกในฟิลิปปินส์และมาเลเซีย"
        },
      ],
      image: "/gene/gene3.jpg",
    },
    Excelsa: {
      title: "Excelsa",
      description:
        "เอ็กเซลซ่าเป็นสายพันธุ์กาแฟที่ปลูกในเอเชียตะวันออกเฉียงใต้และบางส่วนของแอฟริกา มีลักษณะเด่นคือกลิ่นหอมคล้ายผลไม้และดอกไม้ รสชาติซับซ้อน มีความเปรี้ยวและหวานผสมกัน มักถูกนำมาใช้ในการผสมกาแฟเพื่อเพิ่มมิติของรสชาติ พบการปลูกมากในเวียดนามและฟิลิปปินส์",
      subVarieties: [
        {
          name: "SL34",
          description: "SL34 เป็นสายพันธุ์ที่ทนทานต่อสภาพแวดล้อม ให้รสชาติหอมหวาน ซับซ้อน มักปลูกในพื้นที่สูงของเคนยา"
        },
        {
          name: "SL28",
          description: "SL28 ให้รสชาติเปรี้ยวหวาน กลิ่นหอมคล้ายผลไม้ ปลูกได้ในพื้นที่ที่มีความแห้งแล้ง นิยมปลูกในแอฟริกา"
        },
      ],
      image: "/gene/gene4.jpg",
    },
  };


  const handleSubVarietyClick = (subVariety) => {
    setSelectedSubVariety(subVariety);
  };

  return (
    <div className="bg-[#fdfcfb] text-gray-800 font-sans">
      <Navbar />

      <header className="text-center py-6">
        <h1 className="text-2xl md:text-4xl font-bold text-[#5c4033]">
          สายพันธุ์กาแฟ
        </h1>
      </header>

      <div className="flex flex-wrap justify-center pt-4 gap-2">
  {Object.keys(coffeeData).map((variety) => (
    <button
      key={variety}
      onClick={() => {
        setSelectedVariety(variety);
        setSelectedSubVariety("");
      }}
      className={`${
        selectedVariety === variety
          ? "bg-[#7a5647] text-[#FFE2B4] border-[#4e3629] shadow-lg"
          : "bg-[#efdfc3] text-[#4e3629] border-[#7a5647]"
      } px-6 py-2 rounded-lg font-medium shadow-md hover:bg-[#FFE2B4] hover:text-[#4e3629] transition duration-200 border-2`}
    >
      {variety}
    </button>
  ))}
</div>



      <div className="px-4 md:px-16 lg:px-32 py-8">
        <img
          src={coffeeData[selectedVariety].image}
          alt={`${coffeeData[selectedVariety].title} Coffee Beans`}
          className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
        />

        <div className="bg-white p-6 mt-6 rounded-lg shadow-md ">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#7b4b29]">
            {coffeeData[selectedVariety].title}
          </h2>
          <p className="text-gray-700 text-justify mt-4 leading-7">
            {coffeeData[selectedVariety].description}
          </p>
        </div>

        <h2 className="mt-6 text-xl md:text-2xl font-bold text-center text-[#7b4b29] ">
           สายพันธุ์ย่อยของ {coffeeData[selectedVariety].title}
          </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {coffeeData[selectedVariety].subVarieties.map((subVariety) => (
            <div
              key={subVariety.name}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 cursor-pointer hover:shadow-lg flex flex-col justify-center items-center"
              onClick={() => handleSubVarietyClick(subVariety.name)}
            >
              <h2 className="text-xl font-semibold text-orange-600 text-center">
                {subVariety.name}
              </h2>
              <p className="text-gray-700 text-sm mt-2 text-center">
                {subVariety.description}
              </p>
            </div>
          ))}
        </div>



      </div>

      <Footer />
    </div>
  );
};

export default CoffeeVariety;
