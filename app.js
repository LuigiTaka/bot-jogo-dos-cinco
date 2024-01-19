import dotenv from 'dotenv';
import express, {request} from 'express';
import {
    InteractionType,
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes,
    ButtonStyleTypes,
} from 'discord-interactions';
import {
    VerifyDiscordRequest,
    getRandomEmoji,
    DiscordRequest,
    fazerRequisicaoGET,
    setPergunta,
    fazerRequisicaoHTTPComBearerToken
} from './utils.js';

await dotenv.configDotenv();
// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;


if (!process.env.JDC_API_URL) {
    throw Error("URL da API inválida: " + process.env.JDC_API_URL);
}

const API_URL = `${process.env.JDC_API_URL}`

// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({verify: VerifyDiscordRequest(process.env.PUBLIC_KEY)}));

const partidas = new Map();

const PARTIDA_DATA = {
    idChat: "",
    rodada: 5,
    pergunta: "",
    respostas: {}
}

function startGame(idChat) {
    partidas.set(idChat, Object.assign({}, PARTIDA_DATA));
}

function adicionaResposta(idChat, idUsario, nick, resposta) {

    let partida = partidas.get(idChat);
    if (!partida) {
        return false;
    }

    if (!partida.respostas.hasOwnProperty(idUsario)) {
        partida.respostas[idUsario] = {
            nick: nick,
            respostas: []
        }
    }

    partida.respostas[idUsario].respostas.push(resposta);
}

function fimPergunta(idChat) {

    if (!partidas.has(idChat)) {
        return "Nenhum jogo iniciado!";
    }

    let dados = partidas.get(idChat);

    let mensagem = ``;
    for (const usuarioId in dados.respostas) {
        let respostas = dados.respostas[usuarioId].respostas.join("\n");
        mensagem = mensagem.concat("\n", `\t${dados.respostas[usuarioId].nick} \n ${respostas}`);
    }

    partidas.delete(idChat);

    return mensagem;

}

/**
 *
 * /pergunta -> começa a registrar
 * 5 ANIIMES de ação
 *  ## todas os comandos /resposta que forem executados com /pergunta ativo serão consideradas parte do jogo
 * /resposta teste
 * /resposta Jujutsu Kaisen
 * /resposta Naruto
 * /resposta sidfjs sdf sfd
 *
 * /fim
 *
 */
/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
    // Interaction type and data
    const {type, id, data, guild_id, member} = req.body;

    /**
     * Handle verification requests
     */
    if (type === InteractionType.PING) {
        return res.send({type: InteractionResponseType.PONG});
    }

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
        const {name} = data;

        // "test" command
        if (name === 'test') {
            // Send a message into the channel where command was triggered from
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    // Fetches a random emoji to send from a helper function
                    content: 'Mensagem de teste!  ' + getRandomEmoji(),
                },
            });
        }

        if (name === 'pergunta') {
            // Send a message into the channel where command was triggered from
            try {
                let perguntaResult = await fazerRequisicaoGET(`${API_URL}/api/pergunta`);

                let pergunta = 'Sem pergunta';
                if (perguntaResult.hasOwnProperty("pergunta")) {
                    pergunta = perguntaResult.pergunta;
                }

                setPergunta(pergunta);
                //@todo Talvez usar o id do usuário.
                startGame(guild_id);


                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        // Fetches a random emoji to send from a helper function
                        content: pergunta,
                    },
                });
            } catch (e) {

                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        // Fetches a random emoji to send from a helper function
                        content: `Erro no servidor. ${e}`,
                    },
                });
            }
        }


        if (name === "resposta") {
            const idUsuario = member.user.id;
            const resposta = req.body.data.options[0].value;
            adicionaResposta(guild_id, idUsuario, member.user.username, resposta);
            //Queremos pegar a resposta e adicionar em uma lista com todas as respostas. O problema é:
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: "Resposta registrada!"
                }
            });
        }

        if (name === "fim") {


            let respostas = fimPergunta(guild_id);

            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    // Fetches a random emoji to send from a helper function
                    content: respostas,
                },
            });

        }

        if (name === "rn") {
            //@todo Futuramente verificar o ID do usuário efetuando o comando.
            // Se for abrir pra geral pegar a lsita de um banco de dados seria melhor do que hardcode
            let pergunta = req.body.data.options[0];
            let resposta = req.body.data.options[1];


            //@todo Agora a gente não vai esperar nem nada, só executar
            //  afinal a gente nem verifica as respostas enviadas nem nada. AINDA...!
            let response = fazerRequisicaoHTTPComBearerToken(`${API_URL}/api/pergunta`, "PUT", {
                pergunta: pergunta.value,
                respostas: [resposta.value]
            }, process.env.JDC_API_KEY).then((response) => {
                console.log(response);
            }).catch((e) => {
                console.log(e);
            })

            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: "Valeu",
                },
            });
        }

    }


});

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});
