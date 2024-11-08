import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContent } from "../context/AuthContent.jsx";
import InputForm from "../components/InputForm.jsx";
import GeneratedContent from "../components/GeneratedContent.jsx";
import ThemeSelector from "../components/Themeselector.jsx";
import Suggestions from "../components/Suggestions.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Loader from "../components/Loader.jsx";

const themes = {
  clinical: {
    bgColor: "#f5f8f9",
    fontColor: "#2c3e50",
    hlColor: "#3498db",
    fgColor: "#ffffff",
  },
  professional: {
    bgColor: "#ffffff",
    fontColor: "#333333",
    hlColor: "#4caf50",
    fgColor: "#f2f2f2",
  },
  mkbhd: {
    bgColor: "#000",
    fontColor: "#fff",
    hlColor: "#4caf50",
    fgColor: "#333",
  },
  health: {
    bgColor: "#e9f5f7",
    fontColor: "#2c3e50",
    hlColor: "#1abc9c",
    fgColor: "#ffffff",
  },
  serenity: {
    bgColor: "#d6e4f0",
    fontColor: "#364f6b",
    hlColor: "#f6b352",
    fgColor: "#f9f9f9",
  },
  moch: {
    bgColor: "#f2e6d8",
    fontColor: "#3b2925",
    hlColor: "#c19875",
    fgColor: "#f2e6d8",
  },
  tranquility: {
    bgColor: "#fefae0",
    fontColor: "#7e5a2f",
    hlColor: "#c9cba3",
    fgColor: "#d6d6c2",
  },
  rose_milk: {
    bgColor: "#fce4ec",
    fontColor: "#333",
    hlColor: "#f48fb1",
    fgColor: "#fff0f6",
  },
};

const Home = () => {
  const [generatedContent, setGeneratedContent] = useState([]);
  const [savedContent, setSavedContent] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useContext(AuthContent);
  const navigate = useNavigate();
  const [selectedSidebarItem, setSelectedSidebarItem] = useState(null);
  const [currentInput, setCurrentInput] = useState("");
  const [promptLogin, setPromptLogin] = useState(false);
  const api_url = import.meta.env.VITE_API_URL;
  const fetchSavedContent = async () => {
    if (user) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${api_url}/medicine/getContent`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSavedContent(
          response.data.sort((a, b) => new Date(b.date) - new Date(a.date))
        );
      } catch (error) {
        console.error("Error fetching saved content:", error);
      }
    }
  };

  useEffect(() => {
    fetchSavedContent();
  }, [user]);

  const changeTheme = (themeName) => {
    setSelectedTheme(themeName);
    const theme = themes[themeName];
    document.documentElement.style.setProperty("--bg-color", theme.bgColor);
    document.documentElement.style.setProperty("--font-color", theme.fontColor);
    document.documentElement.style.setProperty("--hl-color", theme.hlColor);
    document.documentElement.style.setProperty("--fg-color", theme.fgColor);
  };

  const handleGenerateContent = async (content) => {
    setLoading(true);
    setCurrentInput(content);

    try {
      const response = await axios.post(
        `${api_url}/ai/generate`,
        {
          medicineName: content,
        }
      );
      const generatedContent = response.data.content;

      const newContent = [
        { type: "ai", content: generatedContent, medicineName: content },
      ];

      setTimeout(() => {
        setGeneratedContent(newContent);
        setShowSuggestions(false);
        setSelectedSidebarItem(null);
        setLoading(false);

        if (user) {
          const token = localStorage.getItem("token");
          if (token) {
            const contentExists = savedContent.some(
              (item) => item.medicineName === content
            );
            if (!contentExists) {
              const newSavedItem = {
                medicineName: content,
                content: generatedContent,
                date: new Date().toISOString(),
              };
              setSavedContent((prevContent) => [newSavedItem, ...prevContent]);
              axios
                .post(
                  `${api_url}/ai/save`,
                  newSavedItem,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                )
                .catch((error) => {
                  console.error("Error saving content:", error);
                  setSavedContent((prevContent) =>
                    prevContent.filter((item) => item.medicineName !== content)
                  );
                });
            }
          }
        } else {
          setPromptLogin(true);
        }
      }, 1000);
    } catch (error) {
      console.error("Error generating content:", error);
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarItemClick = (item) => {
    setSelectedSidebarItem(item);
    setCurrentInput(item.medicineName);
    setGeneratedContent([
      { type: "ai", content: item.content, medicineName: item.medicineName },
    ]);
    setShowSuggestions(false);
  };

  return (
    <div className="flex">
      <Sidebar
        savedContent={savedContent}
        user={user}
        onLogout={logout}
        onLoginClick={() => navigate("/login")}
        onSignUpClick={() => navigate("/signup")}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        onItemClick={handleSidebarItemClick}
        selectedItem={selectedSidebarItem}
      />
      <div className={`flex-1 p-4  ${sidebarOpen ? "ml-64" : ""}`}>
        <button
          className="mb-4 ml-4 p-4 text-white bg-indigo-600 rounded hover:bg-indigo-700 transition"
          onClick={toggleSidebar}
        >
          ☰
        </button>
        <ThemeSelector themes={themes} changeTheme={changeTheme} />
        <div className="mt-4">
          {loading && <Loader loading={loading} />}
          {!loading && showSuggestions && (
            <div className="bg-white p-6 rounded shadow">
              <h1 className="text-xl font-semibold text-center">Welcome to AI Pharma</h1>
              <p className="text-gray-700 mt-2 text-center mb-2">
                Choose a medicine or search for one below:
              </p>
            </div>
          )}
          {!loading && currentInput && (
            <div className="p-5 text-center bg-white shadow rounded mt-5 border">
              <h2 className="text-lg font-bold text-indigo-600 mt-2">
                Current Input: {currentInput}
              </h2>
            </div>
          )}
          {!loading && <GeneratedContent generatedContent={generatedContent} />}
          {!loading && showSuggestions && (
            <Suggestions onSuggestionClick={handleGenerateContent} />
          )}
          {!loading && (
            <InputForm setGeneratedContent={handleGenerateContent} />
          )}
          {!loading && promptLogin && (
            <div className="p-4 mt-4 bg-white shadow rounded text-center border">
              <p className="text-sm text-gray-700">
                To save your content, please{" "}
                <button
                  className="text-indigo-600 hover:underline"
                  onClick={() => navigate("/login")}
                >
                  log in
                </button>{" "}
                or{" "}
                <button
                  className="text-indigo-600 hover:underline"
                  onClick={() => navigate("/signup")}
                >
                  sign up
                </button>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
