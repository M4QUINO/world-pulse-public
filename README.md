# World Pulse

Portal premium de noticias com:

- feed infinito
- editorial com video e imagem
- debate anonimo
- radio integrada
- area do estudante com busca em fontes academicas, livros e textos autorais

## Rodar localmente

### Um clique

```bat
start-world-pulse.bat
```

### Manual

Backend:

```bash
cd backend
npm install
npm start
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Compartilhar na rede local

```bat
compartilhar-world-pulse.bat
```

Depois abra:

```text
http://SEU-IP:3001
```

## Publicar gratis na internet

Este projeto ficou preparado para deploy publico gratuito no **Render** usando o arquivo [render.yaml](</C:/Users/mateus.aquino/Documents/LEADS/render.yaml:1>).

### O dominio gratis

No Render, o app recebe um subdominio publico no formato:

```text
https://SEU-NOME.onrender.com
```

Para este projeto, o nome configurado foi:

```text
world-pulse-public
```

Entao o endereco esperado sera algo como:

```text
https://world-pulse-public.onrender.com
```

Se esse nome ja estiver em uso, o Render vai pedir outro nome disponivel.

### Passo a passo

1. Crie uma conta gratis no Render.
2. Suba este projeto para um repositório publico no GitHub.
3. No Render Dashboard, clique em `New`.
4. Escolha `Blueprint`.
5. Conecte o repositório deste projeto.
6. O Render vai ler automaticamente o arquivo `render.yaml`.
7. Confirme a criacao do servico gratuito.
8. Aguarde o build terminar.
9. Abra a URL publica `onrender.com` gerada.

### Como o deploy foi configurado

Arquivos preparados:

- [render.yaml](</C:/Users/mateus.aquino/Documents/LEADS/render.yaml:1>)
- [package.json](</C:/Users/mateus.aquino/Documents/LEADS/package.json:1>)
- [.gitignore](</C:/Users/mateus.aquino/Documents/LEADS/.gitignore:1>)

Scripts usados no deploy:

- `npm run build:render`: instala dependencias do backend e frontend, depois gera o `frontend/dist`
- `npm run start:render`: sobe o backend Express, que tambem entrega o frontend ja compilado

## Limitacao importante do plano gratis

O plano gratuito do Render tem uma limitacao real: o servico entra em idle depois de um periodo sem acesso. Com isso:

- a primeira abertura depois de um tempo pode demorar um pouco
- o `node-cron` interno nao fica ativo enquanto o servico estiver dormindo
- notificacoes em tempo real e atualizacao automatica podem ficar menos consistentes quando nao houver visitantes

Ou seja: para **demo publica gratis**, funciona bem. Para comportamento 100% continuo, depois vale migrar para uma arquitetura sem sleep.

## Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Backend: Node.js + Express + Socket.io + node-cron
- Persistencia demo: JSON local
