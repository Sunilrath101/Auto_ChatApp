import { useState, useEffect } from "react";
import axios from "axios";

import send from "./assets/send.svg";
import user from "./assets/user.png";
import bot from "./assets/bot.png";
import loadingIcon from "./assets/loader.svg";

function App() {
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);
  const [inputField, setInputfield] = useState(false);

  useEffect(() => {
    document.querySelector(".layout").scrollTop =
      document.querySelector(".layout").scrollHeight;
  }, [posts]);

  const fetchBotResponse = async () => {
    const { data } = await axios.post(
      // "https://chatgpt-ai-app-od21.onrender.com",
      "http://localhost:5000",
      { input },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(data.bot);
    return data;
  };

  const autoTypingBotResponse = (text) => {
    let index = 0;
    let interval = setInterval(() => {
      if (index < text.length) {
        setPosts((prevState) => {
          // console.log(prevState);
          let lastItem = prevState.pop();
          if (lastItem.type !== "bot") {
            prevState.push({
              type: "bot",
              post: text.charAt(index - 1),
            });
          } else {
            prevState.push({
              type: "bot",
              post: lastItem.post + text.charAt(index - 1),
            });
          }
          return [...prevState];
        });
        index++;
      } else {
        clearInterval(interval);
        setInputfield(() => false);
      }
    }, 20);
  };

  const onSubmit = () => {
    if (input.trim() === "") return;
    updatePosts(input);
    setInputfield(() => true);
    updatePosts("loading....", false, true);
    setInput("");
    fetchBotResponse()
      .then((res) => {
        // console.log(res.bot.trim());
        updatePosts(res.bot.trim(), true, false);
      })
      .catch((err) => {
        updatePosts(
          "There is Some Error.....\nAsk Again........ ",
          true,
          false
        );
        setInputfield(() => false);

        console.log(err);
      });
  };

  const updatePosts = (post, isBot, isLoading) => {
    if (isBot) {
      autoTypingBotResponse(post);
    } else {
      setPosts((prevState) => {
        return [
          ...prevState,
          {
            type: isLoading ? "loading" : "user",
            post,
          },
        ];
      });
    }
  };

  const onKeyUp = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      onSubmit();
    }
  };

  return (
    <main className="chatGPT-app">
      <div className="title">MY ChatApp</div>
      <section className="chat-container">
        <div className="layout">
          {posts.map((el, index) => (
            <div
              key={index}
              className={`chat-bubble ${
                el.type === "bot" || el.type === "loading" ? "bot" : ""
              }`}
            >
              <div className="avatar">
                <img
                  src={el.type === "bot" || el.type === "loading" ? bot : user}
                  alt="send_logo"
                />
              </div>
              {el.type === "loading" ? (
                <div className="loader">
                  <img src={loadingIcon} alt="loader" />
                </div>
              ) : (
                <div className="post">{el.post}</div>
              )}
            </div>
          ))}
        </div>
      </section>
      <footer>
        <input
          className="composebar"
          value={input}
          autoFocus
          type="text"
          placeholder="Ask anything!"
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={onKeyUp}
          disabled={inputField}
        />
        <div className="send-button" onClick={onSubmit}>
          <img src={send} alt="send_logo" />
        </div>
      </footer>
    </main>
  );
}

export default App;
