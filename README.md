# :robot: Bot do Jogo dos Cinco

Bem-vindo ao "Jogo dos Cinco"! Este é um desafio envolvente que testa suas habilidades em responder perguntas, com a
complexidade aumentando a cada rodada. Aqui estão os principais recursos do nosso projeto:

## Como Utilizar

### 1. Configuração Inicial

Antes de começar, certifique-se de obter as credenciais necessárias, incluindo ``APP_ID``, ``DISCORD_TOKEN``,
e ``PUBLIC_KEY``. Você pode seguir o tutorial em [Getting Started](https://discord.com/developers/docs/getting-started)
para obter essas informações. Além disso, opcionalmente, você pode definir a variável ``JDC_API_KEY`` no
arquivo ``.env`` para utilizar a API do projeto disponível
em [API do Jogo dos Cinco](https://github.com/LuigiTaka/api-jogo-dos-cinco).

### 2. Executando o Projeto

Use os seguintes comandos para construir e executar o projeto:

```shell
docker compose build
docker compose up -d
```

### 3. Definindo Comandos

Depois de executar o projeto, você pode configurar os comandos necessários com o seguinte comando:

```shell
docker exec jdc-bot bash -c "cd /usr/app && npm run register"
```

## Comandos Disponíveis

- ``/test``
    - Verifica se o bot está rodando corretamente.
- ``/pergunta``
    - Inicia uma nova rodada na sala de conversação atual.
- ``/resposta [RESPOSTA]``
    - Responde à pergunta feita através do comando `/pergunta`.
- ``/votacao``
    - Inicia uma votação onde os usuários podem sinalizar respostas incorretas.
- ``/fim``
    - Encerra a rodada e, caso ``/votacao`` tenha sido utilizado, lista a quantidade de respostas corretas de cada
      participante.
- ``/rn [PERGUNTA] [RESPOSTA]``
    - Adiciona uma resposta válida a uma pergunta.

Esperamos que você se divirta jogando o "Jogo dos Cinco"! Se tiver alguma dúvida ou feedback, não hesite em entrar em
contato. Boa sorte! 