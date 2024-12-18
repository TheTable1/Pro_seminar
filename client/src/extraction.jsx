import Footer from "./footer";
import Navbar from "./navbar";

function Extraction() {
  return (
    <div>
      <Navbar />

      <div>
        <img
          src="/extraction/extraction.jpg"
          className="w-full h-80 md:h-96 object-cover"
          alt="Coffee History 1"
        />

        <h1 className="text-center m-3 text-3xl lg:text-4xl font-bold text-[#5c4033]">
          วิธีการสกัดกาแฟ
        </h1>

        <div className="p-4 pt-0 lg:p-8 bg-gray-100">
          {/* Moka Pot Section */}
          <div className="flex flex-col lg:flex-row bg-white shadow-lg rounded-md mb-8 overflow-hidden">
            {/* Image */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <img
                src="/extraction/extraction2.png"
                alt="Moka Pot"
                className="w-1/2 h-auto object-cover"
              />
            </div>

            {/* Content */}
            <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-beige-light flex justify-center flex-col">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                โมก้าพอต (MOKA POT)
              </h2>
              <p className="text-gray-700 leading-relaxed ">
                Moka Pot หรือหม้อต้มกาแฟแบบอิตาเลียน
                เป็นอุปกรณ์ที่ใช้ในการชงกาแฟโดยอาศัยหลักการของแรงดันไอน้ำที่ดันน้ำร้อนขึ้นผ่านชั้นกาแฟบดละเอียด
                เป็นวิธีการชงที่ค่อนข้างเป็นที่นิยมในแถบยุโรป และลาตินอเมริกา
                ทั้งนี้ยังถูกจัดแสดงในพิพิธภัณฑ์การออกแบบหลายแห่ง
                ด้วยความที่มีรูปทรงที่สวยงามเป็นเอกลักษณ์เนื่องจากสามารถทำกาแฟที่มีรสชาติเข้มข้นและหอมได้ใกล้เคียงกับกาแฟที่ได้จากเครื่องชงเอสเปรสโซ
                แม้ว่าจะไม่ได้มีแรงดันสูงเท่ากับเครื่องชงกาแฟแบบเชิงพาณิชย์ก็ตาม
                Moka Pot มีต้นกำเนิดมาจากประเทศอิตาลี
                ถูกประดิษฐ์ขึ้นครั้งแรกในปี 1933 โดย Alfonso Bialetti
                ผู้ซึ่งเป็นเจ้าของบริษัท Bialetti ซึ่งเป็นผู้ผลิต Moka Pot
                มาจนถึงปัจจุบัน
              </p>
            </div>
          </div>

          {/* Drip Coffee Section */}
          <div className="flex flex-col lg:flex-row-reverse bg-white shadow-lg mb-8 rounded-md overflow-hidden">
            {/* Image */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <img
                src="/extraction/extraction3.jpg" // Replace with the correct image URL
                alt="Drip Coffee"
                className="w-1/2 h-full object-cover"
              />
            </div>
            {/* Content */}
            <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-brown-superlight flex justify-center flex-col">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                กาแฟดริป (Drip)
              </h2>
              <p className="text-gray-700 leading-relaxed">
                เป็นวิธีการชงกาแฟที่ได้รับความนิยมอย่างมากทั่วโลก
                โดยเฉพาะในเอเชียตะวันออกและสหรัฐอเมริกา
                การชงกาแฟแบบดริปนี้เกิดจากการเทน้ำร้อนผ่านกาแฟบดที่อยู่ในกระดาษกรองหรือกรองสแตนเลส
                น้ำจะค่อยๆ ไหลผ่านผงกาแฟและสกัดสารต่างๆ ออกมา
                ทำให้ได้กาแฟที่มีกลิ่นหอมและรสชาติที่ชัดเจน
                การชงกาแฟดริปใช้เวลาและอุปกรณ์ที่ไม่ซับซ้อน
                แต่มีความต้องการความพิถีพิถันในเรื่องของอุณหภูมิและการเทน้ำ
                เพื่อให้ได้กาแฟที่มีรสชาติที่ดี
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row bg-white shadow-lg rounded-md mb-8 overflow-hidden">
            {/* Image */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <img
                src="/extraction/extraction4.jpg"
                alt="Moka Pot"
                className="w-1/2 h-auto object-cover"
              />
            </div>

            {/* Content */}
            <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-beige-light flex justify-center flex-col">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                เฟรนช์เพรส (French Press)
              </h2>
              <p className="text-gray-700 leading-relaxed ">
                เป็นอุปกรณ์การชงกาแฟที่ไม่ยุ่งยากซับซ้อน
                โดยใช้วิธีแบบแช่กาแฟให้ชุ่มน้ำ เพื่อสกัดน้ำกาแฟออกมา
                วิธีนี้จะเป็นการดึงรสชาติของกาแฟได้ดีกว่า
                การปล่อยน้ำให้ไหลผ่านกาแฟ ซึ่งจะทำให้ได้รสชาติกาแฟที่เข้มข้น
                ถึงรสกาแฟแท้ๆมากกว่า อีกหนึ่งลักษณะเด่นของการชงกาแฟแบบ
                เฟรนช์เพรส (French Press) คือ การกรองเอากากกาแฟออกจากน้ำ
                โดยใช้ตะแกรงเหล็กที่มีรูขนาดใหญ่ ปล่อยให้กาแฟไหลผ่านเข้าไปในแก้ว
                ซึ่งจุดนี้ จะกลายเป็นข้อดี ที่ทำให้น้ำกาแฟ
                และกากกาแฟเล็กน้อยผสมผสานกันอย่างลงตัว ทำให้รสชาติของกาแฟ
                ยิ่งมีความเข้มข้น
                สัมผัสถึงความเป็นกาแฟรสชาติสไตล์ฝรั่งเศสได้อย่างง่ายดาย
                แต่วิธีการนี้ อาจไม่ถูกใจสำหรับคนที่ไม่ชอบตะกอนกาแฟเท่าไหร่
                เพราะจะมีตะกอนตกไปอยู่ก้นแก้ว และหากพลาดซดตะกอนเข้าไป
                รสชาติของความอร่อย จะเปลี่ยนเป็นเหมือนกินเม็ดทรายเข้าไปทันที
              </p>
            </div>
          </div>

          {/* Drip Coffee Section */}
          <div className="flex flex-col lg:flex-row-reverse bg-white shadow-lg mb-8 rounded-md overflow-hidden">
            {/* Image */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <img
                src="/extraction/extraction5.jpg" // Replace with the correct image URL
                alt="Drip Coffee"
                className="w-1/2 h-full object-cover"
              />
            </div>
            {/* Content */}
            <div className="w-full lg:w-1/2 p-4  lg:p-6 bg-brown-superlight flex justify-center flex-col">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                เครื่องเอสเปรสโซ่ (Espresso)
              </h2>
              <p className="text-gray-700 leading-relaxed">
                เครื่องชงกาแฟเอสเพรสโซ่
                คืออุปกรณ์ที่สร้างสรรค์รสชาติเข้มข้นของกาแฟให้เราได้ลิ้มลอง
                ด้วยการใช้แรงดันน้ำร้อนสูงบีบผ่านกาแฟบดละเอียด
                ทำให้ได้กาแฟที่มีครีมสีน้ำตาลทอง (Crema) ลอยอยู่ด้านบน
                ซึ่งเป็นเอกลักษณ์ที่บ่งบอกถึงคุณภาพของเอสเพรสโซ่แท้ๆ
                นอกจากจะได้รสชาติกาแฟที่เข้มข้นแล้ว
                เครื่องชงกาแฟเอสเพรสโซ่ยังช่วยให้เราได้สัมผัสกับรสชาติที่แท้จริงของกาแฟอย่างเต็มที่
                ชงกาแฟได้อย่างรวดเร็ว เหมาะสำหรับคนยุคใหม่
                และยังเป็นฐานของเครื่องดื่มกาแฟยอดนิยมอีกมากมาย เช่น คาปูชิโน่
                ลาเต้ มัคคิอาโต้
                การชงกาแฟด้วยเครื่องชงกาแฟเอสเพรสโซ่จึงเป็นเหมือนศิลปะ
                ที่ต้องใช้ความเข้าใจและฝึกฝน
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row bg-white shadow-lg rounded-md mb-8 overflow-hidden">
            {/* Image */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <img
                src="/extraction/extraction6.jpg"
                alt="Moka Pot"
                className="w-1/2 h-auto object-cover"
              />
            </div>

            {/* Content */}
            <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-beige-light flex justify-center flex-col">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                ดริปเย็น (Cold drip)
              </h2>
              <p className="text-gray-700 leading-relaxed ">
                ดริปเย็น หรือ Cold drip เป็นวิธีการชงกาแฟชนิดหนึ่งที่ใช้ น้ำเย็น
                ในการสกัดกาแฟ แทนที่จะใช้น้ำร้อนเหมือนวิธีการชงกาแฟทั่วไป
                โดยน้ำเย็นจะหยดผ่านกาแฟบดทีละหยดอย่างช้าๆ
                ทำให้ได้กาแฟที่มีรสชาติกลมกล่อม หอมหวานละมุน
                และมีคาเฟอีนต่ำกว่ากาแฟที่ชงด้วยน้ำร้อน
              </p>
            </div>
          </div>

          {/* Drip Coffee Section */}
          <div className="flex flex-col lg:flex-row-reverse bg-white mb-8 shadow-lg rounded-md overflow-hidden">
            {/* Image */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <img
                src="/extraction/extraction7.jpg" // Replace with the correct image URL
                alt="Drip Coffee"
                className="w-1/2 h-full object-cover"
              />
            </div>
            {/* Content */}
            <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-brown-superlight flex justify-center flex-col">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                กาแฟสกัดเย็น (Cold brew)
              </h2>
              <p className="text-gray-700 leading-relaxed">
                มีจุดเริ่มต้นเมื่อประมาณปี 1600
                ซึ่งเป็นยุคที่กาแฟดัตซ์นิยมกันทั่วโลก
                โดยที่เหล่าพ่อค้าจึงค้นหาวิธีนำกาแฟแบบพร้อมดื่มขึ้นไปบนเรือโดยที่ไม่เสียของ
                ทางด้านเอเชีย กาแฟสกัดเย็นได้เข้าสู่ประเทศญี่ปุ่นประเทศแรก
                รู้จักกันในชื่อว่า Kyoto Coffee กาแฟที่ได้จากการสกัดด้วยน้ำเย็น
                โดยการแช่กาแฟบดในน้ำเย็นหรือน้ำอุณหภูมิห้องเป็นเวลานานหลายชั่วโมง
                ซึ่งแตกต่างจากการชงกาแฟทั่วไปที่ใช้น้ำร้อน
                การชงกาแฟสกัดเย็นนี้เป็นการชงที่ง่าย ไม่ซับซ้อน
                แต่ต้องใช่เวลานานกว่าจะได้ลิ้มรสกาแฟ
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row bg-white shadow-lg rounded-md mb-8 overflow-hidden">
            {/* Image */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <img
                src="/extraction/extraction8.jpg"
                alt="Moka Pot"
                className="w-1/3 h-auto object-cover"
              />
            </div>

            {/* Content */}
            <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-beige-light flex justify-center flex-col">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                ไซฟอน (Siphon)
              </h2>
              <p className="text-gray-700 leading-relaxed ">
                ไซฟอน หรือ เครื่องชงกาแฟแบบสุญญากาศ
                เป็นหนึ่งในวิธีการชงกาแฟที่เก่าแก่และมีความพิเศษ
                เพราะอาศัยหลักการทางวิทยาศาสตร์ในการสกัดกาแฟ
                ทำให้ได้กาแฟที่มีรสชาติกลมกล่อม หอมหวาน และมีความซับซ้อน
                ถูกคิดค้นขึ้นในกรุงเบอร์ลินประมาณช่วง 1830s
                แต่ก็มีเสียงแตกบางส่วนที่กล่าวว่ากาแฟไซฟอนนั้นเกิดขึ้นในญี่ปุ่นโดย
                อะกิระ โคโนะ เมื่อปี 1840
                อย่างไรก็ตามกาแฟไซฟอนก็ถือเป็นอีกวิธีชงที่ได้รับความนิยมอย่างแพร่หลายไม่แพ้วิธีอื่นๆ
                ไซฟอนประกอบด้วยกระเปาะแก้วสองส่วนเชื่อมต่อกันด้วยท่อแก้ว
                เมื่อให้ความร้อนกับน้ำในกระเปาะล่าง
                อากาศจะขยายตัวและดันให้น้ำร้อนขึ้นไปยังกระเปาะบน
                ซึ่งมีกาแฟบดอยู่ เมื่อความร้อนลดลง
                น้ำกาแฟจะไหลกลับลงมาสู่กระเปาะล่างพร้อมกับกากกาแฟที่ถูกกรองไว้
              </p>
            </div>
          </div>

          {/* Drip Coffee Section */}
          <div className="flex flex-col lg:flex-row-reverse bg-white shadow-lg mb-8 rounded-md overflow-hidden">
            {/* Image */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <img
                src="/extraction/extraction9.jpg" // Replace with the correct image URL
                alt="Drip Coffee"
                className="w-1/2 h-full object-cover"
              />
            </div>
            {/* Content */}
            <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-brown-superlight flex justify-center flex-col">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                กาแฟแอโรเพรส (Aeropress)
              </h2>
              <p className="text-gray-700 leading-relaxed">
                ริเริ่มขึ้นเมื่อปี 2005 โดยนักฟิสิกส์ อลัน แอดเลอร์ (Alan Adler)
                ผู้คิดค้นเครื่องแอโรเพรสที่มีลักษณะเป็นท่อ 2
                ชิ้นประกอบกันเหมือนไซริงก์
                เป็นอุปกรณ์ชงกาแฟแบบพกพาที่ได้รับความนิยมอย่างมากในหมู่คนรักกาแฟ
                เพราะมีขนาดกะทัดรัด ใช้งานง่าย และสามารถชงกาแฟได้หลากหลายสไตล์
                ซึ่งรสชาติของกาแฟจะเข้มข้นใกล้เคียงกับการชงแบบเอสเพรสโซ
                แอโรเพรสทำงานโดยอาศัยหลักการของการกด
                เมื่อเราเติมน้ำร้อนลงไปในกระบอกที่บรรจุกาแฟบด
                จากนั้นกดลูกสูบลงไป ก็จะได้กาแฟออกมา
                โดยเราสามารถควบคุมความเข้มข้นของกาแฟได้ด้วยการปรับเวลาในการแช่กาแฟ
                และแรงกด
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row bg-white shadow-lg rounded-md mb-8 overflow-hidden">
            {/* Image */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <img
                src="/extraction/extraction10.jpg"
                alt="Moka Pot"
                className="w-2/3 h-auto object-cover"
              />
            </div>

            {/* Content */}
            <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-beige-light flex justify-center flex-col">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                กาแฟไนโตร (Nitro Cold Brew)
              </h2>
              <p className="text-gray-700 leading-relaxed ">
                กาแฟกับเบียร์เหมือนพี่น้องต่างเลือดที่มักมีส่วนเกี่ยวข้องกันอยู่เสมอไม่ทางใดก็ทางหนึ่ง
                อย่าง Coffee Stout
                ในคราฟต์เบียร์ที่มีส่วนผสมกาแฟเป็นตัวชูโรงเพิ่มความเข้มข้นแปลกใหม่ในบอดี้
                ส่วนกาแฟไนโตร (Nitro Cold Brew)
                นั้นเริ่มได้รับความนิยมเมื่อไม่กี่ปีที่ผ่านมา
                ทั้งในหมู่นักดื่มและคอกาแฟที่ชื่นชอบความแปลกใหม่
                เป็นกาแฟสกัดเย็นที่ผ่านการอัดก๊าซไนโตรเจน
                ทำให้ได้กาแฟที่มีฟองละเอียดนุ่มคล้ายครีมเบียร์ รสชาติกลมกล่อม
                หอมหวาน และมีความนุ่มลื่นเมื่อดื่ม
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Extraction;
