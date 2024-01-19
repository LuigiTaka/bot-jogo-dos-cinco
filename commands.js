import 'dotenv/config';
import {capitalize, InstallGlobalCommands, getPerguntas} from './utils.js';

// Simple test command
const TEST_COMMAND = {
    name: 'test',
    description: 'Basic command',
    type: 1,
};

const PERGUNTA_COMMAND = {
    name: "pergunta",
    description: "Sorteia uma pergunta aleatória do jogo dos cinco",
    type: 1
}


const RESPOSTA_COMMAND = {
    name: "resposta",
    description: "Sorteia uma pergunta aleatória do jogo dos cinco",
    type: 1,
    options: [
        {
            type: 3,
            name: 'resposta',
            description: 'Resposta para a última pergunta apresentada por /pergunta',
            required: true
        },
    ]
}

const FIM_COMMAND = {
    name: "fim",
    description: "Finaliza a rodada de perguntas feitas com /pergunta",
    type: 1
}


const ADICIONA_RESPOSTA_COMMAND = {
    name: "rn",
    description: "Adiciona uma resposta para uma das perguntas feitas no chat.",
    type: 1,
    options: [
        {
            type: 3,
            name: "pergunta",
            description: "Uma pergunta feita no chat através do comando /pergunta",
            required: true
        },
        {
            type: 3,
            name: "resposta",
            description: "A resposta que o jogador gostaria de adicionar como válida.",
            required: true
        }
    ]
}
const ALL_COMMANDS = [TEST_COMMAND, PERGUNTA_COMMAND, RESPOSTA_COMMAND, FIM_COMMAND, ADICIONA_RESPOSTA_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);