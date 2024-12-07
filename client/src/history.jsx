import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "./footer";
import Navbar from "./navbar";

function History() {
  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 1000, // ระยะเวลาเอฟเฟกต์ (มิลลิวินาที)
      once: true, // ให้ทำงานเพียงครั้งเดียวเมื่อเลื่อนผ่าน
    });
  }, []);

  return (
    <div className="bg-[#f3f1ec]">
      {/* ส่วนหัว */}
      <Navbar />

      <header className="text-center py-6 bg-[#e8dfd6]">
        <h1
          className="text-3xl lg:text-4xl font-bold text-[#5c4033]"
          data-aos="fade-down"
        >
          ประวัติศาสตร์ของกาแฟ
        </h1>
      </header>

      {/* รูปภาพแรก */}
      <img
        src="/history/history1.jpg"
        className="w-full h-80 md:h-96 object-cover"
        alt="Coffee History 1"
        data-aos="zoom-in"
      />

      {/* เนื้อหาส่วนแรก */}
      <section
        className="flex flex-col md:flex-row text-center px-4 md:px-12 lg:px-24 items-center my-6"
        data-aos="fade-right"
      >
        <p className="md:w-2/3 lg:w-1/2 mx-auto bg-white px-5 py-4 rounded-lg shadow-lg">
          <b className="text-lg text-[#7b4b29]">
            ตำนานต้นกำเนิดกาแฟเริ่มต้นที่ประเทศเอธิโอเปีย
          </b>
          <br />
          <br />
          เอธิโอเปียถือกันว่าเป็นศูนย์กลางของแหล่งกำเนิดกาแฟคุณอาจจะเคยพบเรื่องราวอันโด่งดังเกี่ยวกับการค้นพบ
          กาแฟในเอธิโอเปียโดย Kaldi ผู้เลี้ยงแพะชาวเอธิโอเปียเมื่อราวปี ค.ศ. 800
          เขาเดินไปหาแพะของเขาและ พบว่าพวกมันมีพฤติกรรมแปลกๆ
          พวกมันรู้สึกกระปรี้กระเปร่าและตื่นเต้นหลังจากกินผลเบอร์รี่จากต้นไม้
          ดังนั้นเขาจึงลองชิมผลเบอร์รี่เหล่านั้นด้วยตัวเอง
          และหลังจากที่เขารู้สึกตื่นเต้นและตื่นตัวเช่นกัน
          คัลดีก็เอาผลเบอร์รี่เหล่านี้ไปให้พระภิกษุ
          พระภิกษุอุทานว่าเป็นฝีมือของปีศาจและโยนผลเบอร์รี่เหล่า นั้นลงในกองไฟ
          เมื่อทำเช่นนั้น กลิ่นหอมอันแสนวิเศษก็ลอยออกมา
          และผลเบอร์รี่เหล่านี้ก็ถูกกวาดออกจากกองไฟ
          อย่างรวดเร็วและบดให้ละเอียดเป็นถ่าน พระภิกษุรู้ตัวว่าทำผิด
          จึงใส่ผลเบอร์รี่ลงในเหยือกและเติมน้ำร้อนเพื่อ เก็บรักษา
          พระภิกษุดื่มเครื่องดื่มชนิดใหม่ที่น่ารักนี้ต่อไป
          และพบว่ามันช่วยให้พวกเขาตื่นตัวระหว่างการสวดมนต
          ์และสวดมนต์ทุกคืนเมื่อข่าวแพร่กระจายไปทางตะวันออก
          และกาแฟเดินทางมาถึงคาบสมุทรอาหรับ
          การเดินทางครั้งนี้จึงได้นำเมล็ดกาแฟไปทั่วโลก
        </p>
      </section>

      {/* รูปภาพที่สอง */}
      <img
        src="/history/history2.jpg"
        className="w-full h-80 md:h-96 object-cover my-6"
        alt="Coffee History 2"
        data-aos="zoom-in"
      />

      {/* เนื้อหาส่วนที่สอง */}
      <section
        className="flex flex-col md:flex-row text-center px-4 md:px-12 lg:px-24 items-center my-6"
        data-aos="fade-left"
      >
        <p className="md:w-2/3 lg:w-1/2 mx-auto bg-white px-5 py-4 rounded-lg shadow-lg">
          <b className="text-lg text-[#7b4b29]">
            กาแฟแพร่กระจายไปสู่คาบสมุทรอาหรับ
          </b>
          <br />
          <br />
          เมื่อถึงศตวรรษที่ 15 กาแฟก็เริ่มปลูกในเขตเยเมนของคาบสมุทรอาหรับ
          และเมื่อถึงศตวรรษที่ 16 กาแฟก็เป็นที่รู้จักในเปอร์เซีย อียิปต์ ซีเรีย
          และตุรกีกาแฟไม่เพียงแต่ได้รับความนิยมในบ้านเท่านั้น
          แต่ยังได้รับความนิยมในร้านกาแฟสาธารณะหลายแห่งที่เรียกว่า qahveh khaneh
          ซึ่งเริ่มมีให้เห็นในเมืองต่างๆ ทั่วตะวันออกใกล้
          ร้านกาแฟเหล่านี้ได้รับความนิยมอย่างล้นหลามและผู้คนต่างมา
          ใช้บริการเพื่อทำกิจกรรมทางสังคมต่างๆ ลูกค้าไม่เพียงแต่ดื่มกาแฟและพูดคุยกันเท่านั้น
          แต่ยังฟังเพลง ดูการแสดง เล่นหมากรุก และติดตามข่าวสารด้วย
          ร้านกาแฟจึงกลายเป็นศูนย์กลางที่สำคัญในการแลกเปลี่ยนข้อมูลอย่างรวดเร็ว
          จนมักถูกเรียกว่า “โรงเรียนแห่งปัญญา”ในแต่ละปี
          มีนักแสวงบุญนับพันคนเดินทางมาเยี่ยมเยียนนครเมกกะอันศักดิ์สิทธิ์จากทั่วทุกมุมโลก
          ทำให้ความรู้เกี่ยวกับ “ไวน์แห่งอาหรับ” นี้เริ่มแพร่หลายออกไป 
        </p>
      </section>

      <div className="flex flex-col lg:flex-row items-center justify-center bg-beige mt-5 px-4 md:px-12 lg:px-24">
        <div className="lg:w-1/2 text-center">
          <p className="px-5 py-4">
            <b style={{ color: "brown" }}>ร้านกาแฟแห่งแรกของโลก</b>
            <br />
            <br />
            ร้านกาแฟแห่งแรกของโลกเปิดในกรุงคอนสแตนติโนเปิลในปี 1475
            ซึ่งปัจจุบันรู้จักกันในชื่ออิสตันบูล
            การดื่มกาแฟที่บ้านได้กลายเป็นส่วนหนึ่ง
            ของกิจวัตรประจำวันและเพื่อแสดงการต้อนรับแขกภายนอก
            โดยผู้คนในสมัยนั้นไปเยี่ยมชมร้านกาแฟไม่เพียงแต่ดื่มกาแฟเท่านั้น
            แต่ยังเพื่อสนทนา ฟังเพลง ดูนักแสดง เล่นหมากรุก ซุบซิบ
            และติดตามข่าวสาร หากไม่มีเทคโนโลยีสมัยใหม่ที่เรามีในปัจจุบัน
            ร้านกาแฟก็อาจจะยังคงเป็นศูนย์กลางในการ
            แลกเปลี่ยนและรวบรวมข้อมูลอย่างรวดเร็ว พวกเขามักถูกเรียกว่า
            "โรงเรียนแห่งปัญญา" และในแต่ละปีมีผู้แสวงบุญหลายพันคนที่มาเยือนเมกกะ
            จากทั่วทุกมุมโลก ความรู้เกี่ยวกับ "ไวน์แห่งอาราบี"
            นี้ซึ่งเป็นที่รู้จักอย่างรวดเร็วก็เริ่มแพร่กระจาย
          </p>
        </div>
        <div className="lg:w-1/6">
          <img
            src="/history/history3.png"
            className="w-full"
            alt="Coffee History 3"
          />
        </div>
      </div>

      {/* รูปภาพที่สี่ */}
      <img
        src="/history/history4.jpg"
        className="w-full h-80 md:h-96 object-cover my-6"
        alt="Coffee History 4"
        data-aos="zoom-in"
      />

      {/* เนื้อหาส่วนที่สี่ */}
      <section
        className="flex flex-col md:flex-row text-center px-4 md:px-12 lg:px-24 items-center my-6"
        data-aos="fade-left"
      >
        <p className="md:w-2/3 lg:w-1/2 mx-auto bg-white px-5 py-4 rounded-lg shadow-lg">
          <b className="text-lg text-[#7b4b29]">การแพร่กระจายกาแฟสู่ยุโรป</b>
          <br />
          <br />
          มันกลายเป็นที่นิยมอย่างรวดเร็ว แต่บางคนกลับแสดงความสงสัยและกลัว
          เรียกมันว่า "สิ่งประดิษฐ์อันขมขื่นของซาตาน"
          โดยเฉพาะในเวนิสที่นักบวชท้องถิ่นประณามกาแฟในปี 1615
          จนพระสันตปาปาเคลเมนต์ที่ 8 ต้องเข้ามาชิมด้วยตนเอง
          และทรงรับรองกาแฟเพราะทรงชื่นชอบเครื่องดื่มนี้ หลังจากนั้น
          ร้านกาแฟกลายเป็นศูนย์กลางของกิจกรรมทางสังคมในหลายประเทศ เช่น อังกฤษ
          ออสเตรีย ฝรั่งเศส และเยอรมนี โดยในอังกฤษมี "มหาวิทยาลัยเพนนี"
          ที่ผู้คนสามารถดื่มกาแฟและสนทนากันได้ด้วยเงินเพียงเพนนีเดียว กาแฟค่อย ๆ
          เข้ามาแทนที่เบียร์และไวน์เป็นเครื่องดื่มยามเช้า
          ผู้ดื่มกาแฟรู้สึกตื่นตัวและทำงานได้ดีขึ้น ในลอนดอนมีร้านกาแฟมากกว่า
          300 แห่งภายในกลางศตวรรษที่ 17
          ซึ่งบางร้านกลายเป็นจุดเริ่มต้นของธุรกิจสำคัญ เช่น Lloyd's of London
          ที่ก่อตั้งขึ้นจากร้านกาแฟของ Edward Lloyd
        </p>
      </section>

      <img
        src="/history/history5.png"
        className="w-full h-80 md:h-96 object-cover my-6"
        alt="Coffee History 5"
        data-aos="zoom-in"
      />

      {/* เนื้อหาส่วนที่สี่ */}
      <section
        className="flex flex-col md:flex-row text-center px-4 md:px-12 lg:px-24 items-center my-6"
        data-aos="fade-left"
      >
        <p className="md:w-2/3 lg:w-1/2 mx-auto bg-white px-5 py-4 rounded-lg shadow-lg">
          <b className="text-lg text-[#7b4b29]">กาแฟในยุคปัจจุบัน</b>
          <br />
          <br />
          ในปัจจุบัน กาแฟเป็นหนึ่งในเครื่องดื่มที่ได้รับความนิยมที่สุดในโลก
          วัฒนธรรมการดื่มกาแฟขยายตัวไปทั่วโลก
          มีทั้งร้านกาแฟท้องถิ่นขนาดเล็กจนถึงเชนร้านกาแฟระดับโลก เช่น Starbucks
          และยังมีการพัฒนาวิธีการชงกาแฟใหม่ ๆ เช่น การดริปกาแฟแบบแฮนด์เมด
          การใช้เครื่องเอสเปรสโซ และการปรุงกาแฟสูตรพิเศษที่หลากหลาย เช่น
          กาแฟลาเต้ กาแฟคาปูชิโน่ กาแฟเย็น และเมนูสร้างสรรค์อื่น ๆ
        </p>
      </section>

      {/* การ์ดข้อมูลแต่ละทวีป */}
      <div className="text-center mb-8 mt-12 px-4">
        <h1
          className="text-2xl lg:text-3xl font-bold text-orange-700"
          data-aos="fade-up"
        >
          แหล่งกำเนิดกาแฟแต่ละทวีป
        </h1>
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-12 lg:px-24 mb-5"
        data-aos="zoom-in"
      >
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <img src="/history/history6.png" alt="Africa" />
          <h2 className="text-xl font-semibold text-orange-600">แอฟริกา</h2>
          <p className="text-gray-700 text-sm">
            กาแฟมีต้นกำเนิดจากเอธิโอเปียในภูมิ ภาคที่เรียกว่า Kaffa
            ประมาณศตวรรษที่ 9 ตำนานเล่าว่า ชาวนาเธอดี้ (Kaldi)
            พบว่าแกะของเขามีพลังงานและกระปรี้กระเปร่าเมื่อกินลูกกาแฟ
            สันนิษฐานว่าการใช้เมล็ดกาแฟเริ่มต้นในพื้นที่นี้เป็นครั้งแรก
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <img src="/history/history7.png" alt="Asia" />
          <h2 className="text-xl font-semibold text-orange-600">เอเชีย</h2>
          <p className="text-gray-700 text-sm">
            การปลูกในเอเชียกาแฟเริ่มถูกนำ เข้ามาในเอเชียในศตวรรษที่ 17
            ในช่วงที่มีการค้าขายระหว่างประเทศ
            โดยเฉพาะในประเทศที่มีสภาพภูมิอากาศที่เหมาะสม เช่น อินโดนีเซีย
            เวียดนาม และไทย การปลูกในอินโดนีเซีย อินโดนีเซียเป็นหนึ่งในประเทศแรก
            ๆ ที่เริ่มปลูกกาแฟนอกทวีปแอฟริกา
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <img src="/history/history8.png" alt="America" />
          <h2 className="text-xl font-semibold text-orange-600">อเมริกา</h2>
          <p className="text-gray-700 text-sm">
            กาแฟถูกนำเข้ามาในอเมริกาใต้ใน ศตวรรษที่ 18 โดยเฉพาะจากบราซิลและ
            โคลอมเบีย จากนั้นกาแฟกลายเป็นพืช เศรษฐกิจที่สำคัญในภูมิภาคนี้
            บราซิลกลายเป็นผู้ผลิตกาแฟรายใหญ่ที่สุดในโลกในศตวรรษที่
            19โดยมีการพัฒนา การปลูกกาแฟและการส่งออกอย่าง รวดเร็ว
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <img src="/history/history9.png" alt="Europe" />
          <h2 className="text-xl font-semibold text-orange-600">ยุโรป</h2>
          <p className="text-gray-700 text-sm">
            การแพร่กระจาย กาแฟเข้าสู่ยุโรป ในศตวรรษที่ 17 โดยเริ่มจากประเทศใน
            ตะวันออกกลางและเข้าสู่พื้นที่ของอิตาลี ฝรั่งเศส และอังกฤษ
            กาแฟกลายเป็นที่ นิยมในหมู่ชนชั้นสูงและกลุ่มผู้มีอิทธิพล
          </p>
        </div>
      </div>

      {/* ส่วนท้าย */}
      <Footer />
    </div>
  );
}

export default History;
