import 'dotenv/config';
import fetch from 'node-fetch';
import { verifyKey } from 'discord-interactions';

const PERGUNTAS = new Set();

export function getPerguntas() {
  return PERGUNTAS.values();
}

export function setPergunta(pergunta) {
  PERGUNTAS.add(pergunta)
}

export async function fazerRequisicaoHTTPComBearerToken(url, metodo, dados, tokenBearer) {
  try {
    // Configuração do cabeçalho de autenticação Bearer
    const headers = {
      'Authorization': `Bearer ${tokenBearer}`,
      'Content-Type': 'application/x-www-form-urlencoded', // Define o tipo de conteúdo como JSON
    };

    let searchParams = new URLSearchParams();

    for (const dadosKey in dados) {
      searchParams.append( dadosKey,dados[dadosKey] );
    }

    // Configuração dos dados e método da requisição
    const config = {
      method: metodo,
      headers: headers,
      body: searchParams.toString(),
    };

    // Faz a requisição
    const resposta = await fetch(url, config);

    // Verifica se a requisição foi bem-sucedida (status 2xx)
    if (!resposta.ok) {
      throw new Error(`Erro na requisição HTTP: ${resposta.status} - ${resposta.statusText}`);
    }


    let c =  await resposta.text();
    console.log( c );
    return { teste:1 };
    // Converte a resposta para JSON e retorna os dados
    return await resposta.json();
  } catch (erro) {
    // Trata erros, por exemplo, logando no console
    console.error(erro.message);
    throw erro; // Lança o erro novamente para que seja tratado no código que chama a função, se necessário
  }
}

export async function fazerRequisicaoGET(url) {
  try {
    // Faz a requisição GET
    const resposta = await fetch(url);

    // Verifica se a requisição foi bem-sucedida (status 2xx)
    if (!resposta.ok) {
      throw new Error(`Erro na requisição GET: ${resposta.status} - ${resposta.statusText}`);
    }

    // Converte a resposta para JSON e retorna os dados
    return await resposta.json();
  } catch (erro) {
    // Trata erros, por exemplo, logando no console
    console.error(erro.message);
    throw erro; // Lança o erro novamente para que seja tratado no código que chama a função, se necessário
  }
}

export function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf, encoding) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
}

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
}

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = ['😭','😄','😌','🤓','😎','😤','🤖','😶‍🌫️','🌏','📸','💿','👋','🌊','✨'];
  //const emojiList = ['A','B'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
