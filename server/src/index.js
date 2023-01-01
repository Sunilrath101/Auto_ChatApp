const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");
const PORT = process.env.SERVER_PORT || 5000;

dotenv.config({ path: "./config/.env" });
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from the Server ");
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/", async (req, res) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: req.body.input,
      temperature: 0,
      max_tokens: 4000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    // console.log("PASSED: ", response.data.choices[0].text);

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    // console.error(error);
    res.status(500).send(error);
  }
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is listening on port ${PORT}`);
});
