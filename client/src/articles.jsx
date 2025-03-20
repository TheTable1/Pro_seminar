import { useState, useEffect } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import Articles from "./article.json";
import BackToTop from "./BackToTop";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { updateUserAchievement } from "./firebase/firebaseAchievements";

const articles = Articles;

function ArticlesPage() {
  const [activeFilter, setActiveFilter] = useState("บทความทั้งหมด");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState(null);

  // ตรวจสอบว่าผู้ใช้ล็อกอินหรือไม่
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else setUserId(null);
    });
  }, []);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "บทความทั้งหมด" ||
      (article.category && article.category.includes(activeFilter));
    return matchesSearch && matchesFilter;
  });

  // เมื่อผู้ใช้เปิดอ่านบทความ (selectedArticle) และเลื่อนจนเกือบจบบทความ
  useEffect(() => {
    if (!selectedArticle || !userId) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const contentHeight = document.body.scrollHeight;
      const viewportHeight = window.innerHeight;
      if (scrollY + viewportHeight >= contentHeight - 100) {
        // ใช้ article.id ถ้ามี หรือ article.title เป็นตัวระบุ
        const achievementId = selectedArticle.id || selectedArticle.title;
        console.log("✅ บันทึกความสำเร็จบทความ:", achievementId);
        updateArticleAchievement(userId, achievementId, true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedArticle, userId]);

  // เมื่อคลิกเลือกบทความแล้วให้เลื่อนขึ้นไปบนสุดของเนื้อหาบทความ
  useEffect(() => {
    if (selectedArticle) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedArticle]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleBack = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <BackToTop />
      <main className="lg:p-6 sm:p-0">
        {selectedArticle ? (
          <div className="bg-white rounded-lg shadow-md p-5">
            <button
              onClick={handleBack}
              className="mb-4 px-2 py-1 rounded-full text-brown hover:bg-brown hover:text-white"
            >
              กลับ
            </button>
            <h2 className="text-center text-xl font-bold mb-4 bg-brown text-beige py-2 px-1">
              {selectedArticle.title}
            </h2>
            <h2 className="text-md py-2 px-1">• {selectedArticle.post_date}</h2>
            <h2 className="text-md py-2 px-1">• {selectedArticle.author}</h2>
            {selectedArticle.content?.map((content, index) => {
              if (content.type === "paragraph") {
                return (
                  <p
                    key={index}
                    className="text-gray-700 text-base leading-7 mb-4 px-1 md:!px-16 lg:!px-36 whitespace-pre-line"
                  >
                    {content.text}
                  </p>
                );
              }
              if (content.type === "image") {
                return (
                  <img
                    key={index}
                    className="mx-auto w-3/3 sm:w-2/3 md:w-1/3 h-auto mb-6 rounded-lg"
                    src={content.src}
                    alt={content.alt}
                  />
                );
              }
              if (content.type === "subheading") {
                return (
                  <h3
                    key={index}
                    className="text-lg font-semibold mb-3 px-1 md:!px-16 lg:!px-36"
                  >
                    {content.text}
                  </h3>
                );
              }
              return null;
            })}
            <h5 className="px-1 md:!px-16 lg:!px-36 mt-24">
              ที่มา :{" "}
              <a href={selectedArticle.related_articles}>
                {selectedArticle.related_articles}
              </a>
            </h5>
          </div>
        ) : (
          <section className="bg-white rounded-lg shadow-md transition duration-200 ease-in-out hover:shadow-lg pb-4">
            <div className="p-2 md:p-3 lg:p-5 ">
              {/* Search Bar */}
              <div className="mb-6 flex justify-center ">
                <input
                  type="text"
                  placeholder="ค้นหาบทความ..."
                  className="md:w-2/5 sm:w-2/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-4 lg:gap-6 mb-6">
                {[
                  "บทความทั้งหมด",
                  "ความรู้เบื้องต้น",
                  "เทคนิคชงกาแฟ",
                  "เคล็ดลับการเลือกซื้อ",
                ].map((filter) => (
                  <button
                    key={filter}
                    className={`px-4 py-2 rounded-full text-sm md:text-base transition duration-200 ease-in-out ${
                      activeFilter === filter
                        ? "bg-brown text-white"
                        : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
                    onClick={() => handleFilterChange(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Article Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-brown-light rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer"
                    onClick={() => handleArticleClick(article)}
                  >
                    <div className="p-4">
                      <img
                        className="w-full h-40 object-cover mb-4 rounded"
                        src={article.content[0]?.src || ""}
                        alt={article.title}
                      />
                      <h3 className="text-dark-brown text-md font-bold mb-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {article.content[0]?.text || ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default ArticlesPage;
