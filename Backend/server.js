const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicializando a API do Gemini
const chaveAPI = new GoogleGenerativeAI('AIzaSyCK2OuGBxXGyyje5P201VptjVdWPstdAlw'); // Substitua "YOUR_API_KEY" pela sua chave API real

// Configurando o servidor
const app = express();

// Configura o CORS para permitir qualquer origem
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Middleware para JSON e arquivos estáticos
app.use(express.json());
app.use(express.static('public'));

// Endpoint para enviar mensagens e obter resposta da Gemini
app.post('/send-message', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const model = chaveAPI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Novo prompt que limita o chatbot a responder apenas a perguntas de matemática
    const prompt = `
    Você é um assistente especializado em matemática, com foco em cálculos matemáticos e de 
    administração de medicamentos. Responda apenas a perguntas de matemática e cálculos de administração 
    de medicamentos, como regra de três, dosagens, multiplicação, divisão e proporções. 
    Caso receba uma pergunta fora desses tópicos, responda com uma mensagem como 
    'Sou especializado apenas em cálculos matemáticos e de administração de medicamentos. 
    Posso te ajudar com algo nesse sentido?"
      
      Pergunta: ${userMessage}
    `;
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    // Retornar a resposta do modelo Gemini
    res.json({ response: responseText });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: 'Erro ao se comunicar com a API Gemini' });
  }
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
