import { useState } from "react";  
import Navbar from "./navbar";
import Footer from "./footer";
import Articles from "./article.json";

const articles = Articles;

function ArticlesPage() {
  const [activeFilter, setActiveFilter] = useState("บทความทั้งหมด");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filterButtons = ["บทความทั้งหมด", "ความรู้เบื้องต้น", "เทคนิคชงกาแฟ", "เคล็ดลับการเลือกซื้อ"];

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleBack = () => {
    setSelectedArticle(null);
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "บทความทั้งหมด" ||
      (article.category && article.category.includes(activeFilter));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="lg:p-6 sm:p-0">
        {selectedArticle ? (
          <div className="bg-white rounded-lg shadow-md p-5">
            <button
              onClick={handleBack}
              className="mb-4 px-2 py-1 rounded-full text-brown hover:bg-brown hover:text-white"
            >
              กลับ
            </button>
            <h2 className="text-center text-xl font-bold mb-4 bg-brown text-beige py-2">{selectedArticle.title}</h2>
            {selectedArticle.content?.map((content, index) => {
              if (content.type === "paragraph") {
                return <p key={index} className="text-gray-700 text-base leading-7 mb-4">{content.text}</p>;
              }
              if (content.type === "image") {
                return (
                  <img
                    key={index}
                    className="mx-auto w-1/3 h-auto mb-6 rounded-lg"
                    src={content.src}
                    alt={content.alt}
                  />
                );
              }
              if (content.type === "subheading") {
                return <h3 key={index} className="text-lg font-semibold mb-4">{content.text}</h3>;
              }
              return null;
            })}
          </div>
        ) : (
          <section className="bg-white rounded-lg shadow-md transition duration-200 ease-in-out hover:shadow-lg">
            <div className="p-2 md:p-3 lg:p-5">
              {/* Search Bar */}
              <div className="mb-6 flex justify-center">
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
                {filterButtons.map((filter) => (
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
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer"
                    onClick={() => handleArticleClick(article)}
                  >
                    <div className="p-4">
                      <img className="w-full h-40 object-cover mb-4 rounded" src={article.content[0]?.src || ""} alt={article.title} />
                      <h3 className="text-dark-brown text-lg font-bold mb-2">
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
