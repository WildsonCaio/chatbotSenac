const express = require('express');
const cors = require('cors');
// Certifique-se de ter configurado corretamente o pacote da API do Google
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicializando a API do Gemini
const apiKey = 'AIzaSyCK2OuGBxXGyyje5P201VptjVdWPstdAlw'; // Substitua pela sua chave API real
const geminiAPI = new GoogleGenerativeAI({ apiKey });

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
app.use(express.static('public')); // Certifique-se de ter uma pasta 'public' para arquivos estáticos

// Endpoint para enviar mensagens e obter resposta da Gemini
app.post('/send-message', async (req, res) => {
  const userMessage = req.body.message;

  try {
    // Defina o modelo Gemini corretamente
    const model = geminiAPI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Prompt que limita o chatbot a responder apenas a perguntas de matemática
    const prompt = `
      Você é um professor de matemática especializado em ajudar com cálculos de administração de medicamentos.
      Responda apenas perguntas relacionadas a cálculos básicos de matemática e administração de medicamentos, como multiplicação, divisão e regra de três simples.
      Se a pergunta for fora desse tema, responda: "Desculpe, só posso ajudar com cálculos matemáticos."
      
      Pergunta: ${userMessage}
    `;

    // Use a função de geração de conteúdo do modelo
    const result = await model.generateText({ prompt });

    // Obtenha o texto da resposta
    const responseText = result?.data?.text || 'Não foi possível gerar uma resposta no momento.';

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
