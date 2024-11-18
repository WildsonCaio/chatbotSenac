const { GoogleGenerativeAI } = require("@google/generative-ai");

const chaveAPI = new GoogleGenerativeAI("AIzaSyCK2OuGBxXGyyje5P201VptjVdWPstdAlw");
const model = chaveAPI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "Você é um professor de matemática. Responda apenas a perguntas de matemática. Se a pergunta não for sobre matemática, responda: Desculpe, só posso responder perguntas de matemática. Pergunta: você é um pato?";

async function generateText(){
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
}

generateText()