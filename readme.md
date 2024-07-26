# ConectaONG

## Descrição do Projeto

ConectaONG é um site que conecta voluntários a ONGs, facilitando o engajamento e a organização de atividades voluntárias. 

O sistema contém funcionalidades de login, cadastro de usuários, listagem de ONGs, cadastro de ONGs e perfis de usuário diferenciados entre ADMIN e usuário comum. 

- O usuário comum consegue visualizar todas as ONGs cadastradas com suas devidas informações (nome, cidade, estado, contato e descrição) além de poder favoritar as suas ONGs prediletas.

- O usuário do tipo ADMIN além de visualizar as ONGs cadastradas, pode adicionar, remover e editar as ONGs do sistema. Ele também pode categorizar os usuários como "Bronze", "Prata" e "Ouro".

### Funcionalidades

#### **Cadastro de Usuários (Admin/User Comum):** 
- Permite registrar membros de acordo com tipo (Admin ou User Comum). 
- Armazena os dados de: Nome completo, E-mail, Senha (Criptografada) e Tipo de usuário (ADMIN ou usuário).
- Possui validação de campos (e-mail válido, senha forte e e-mail não pode ser repetido).

#### **Login de Usuários (Admin/User Comum):** 
- Permite realizar autenticação de usuários e recuperação de senha. 
- No processo de recuperação de senha, o usuário solicita que "Esqueceu a senha" e um e-mail com o token de recuperação de senha é enviado.
  
#### **Lista de ONGs:** 
- Os usuários podem visualizar a lista de ONGs cadastradas.
- As listas de ONGs contém os campos de Nome da ONG, Descrição, Cidade, Estado, Área de atuação e Contato.

- Possui como funcionalidades: 

  - Listagem paginada de ONGs.
  - Filtro por localização e área de atuação.
  - Pesquisa por nome da ONG.
  - Clique para visualizar mais detalhes de cada ONG.

#### **Cadastrar novas ONGs:** 
- Somente os usuários do tipo Admin podem cadastrar novas ONGs.

- Possui como funcionalidades: 
  - Formulário de cadastro com validação de campos.
  - Apenas ADMIN pode cadastrar novas ONGs.
  
#### **Acessar o seu perfil de usuário:** 
- Para o usuário comum permite:
  - Visualização de informações pessoais
  - Listagem de ONGs nas quais está inscrito (pode favoritar e desfavoritar)
  - Opção para editar perfil e senha

- Para o usuário Admin permite:
  - Visualização de informações pessoais 
  - Opção para editar perfil e senha
  - Gestão de ONGs (adicionar, editar e remover ONGs)
  - Listagem e gerenciamento de usuários (promover ou rebaixar usuários)

### Front-End

O front-end é desenvolvido em Next.js, proporcionando uma interface intuitiva e interativa para visualizar e gerenciar ONGs.

### Back-End

O back-end consiste em uma API Node.js que gerencia as operações CRUD (Criar, Ler, Atualizar, Deletar) para usuários e ONGs. Esta API interage com o Firebase Firestore para armazenamento de dados.

### Firebase

Utiliza o Firestore para armazenamento de dados de usuários e ONGs. Implementa a autenticação de usuários com Firebase Authentication.

## Instruções para Rodar o Projeto

1. Clone o repositório do front-end:
 ```js
git clone https://github.com/laraberns/Hackathon-PosTech/front-end
 ```
 
2. Na pasta `front-end`, instale as dependências:
 ```js
npm install
 ```

3. Adicione um arquivo `next.config.js` com suas chaves do Firebase e banco de dados. Adicione também images > domain com a url "firebasestorage.googleapis.com":
```js
module.exports = {
  env: {
    FIREBASE_API_KEY: "sua-api-key",
    FIREBASE_AUTH_DOMAIN: "seu-auth-domain.firebaseapp.com",
    FIREBASE_PROJECT_ID: "seu-project-id",
    FIREBASE_STORAGE_BUCKET: "seu-storage-bucket.appspot.com",
    FIREBASE_MESSAGING_SENDER_ID: "seu-messaging-sender-id",
    FIREBASE_APP_ID: "seu-app-id",
    FIREBASE_FCM_VAPID_KEY: "sua-fcm-vapid-key",
    BD_API: "seuBancoDeDadosAPI"
  },
  images: {
    domains: ["firebasestorage.googleapis.com"]
  }
};
```

4. Na pasta `front-end`, rode o projeto front-end:
 ```js
npm run dev
 ```

5. Acesse a tela de login:
 ```js
"http://localhost:3000/registrar"
 ```

6. Clone o repositório do backend dentro do seu diretório:
 ```js
git clone https://github.com/laraberns/Hackathon-PosTech/back-end
 ```

7. Na pasta `back-end`, instale as dependências:
 ```js
npm install
 ```

8. No Firebase Console, siga as etapas abaixo para configurar o serviço:
- Acesse as Configurações do Projeto no Firebase Console.
- Vá para Contas de Serviço e gere uma nova chave privada. Isso criará um arquivo JSON que você deve nomear como creds.json.
- Coloque o arquivo creds.json na pasta raiz do projeto backend (back).

9. Crie um arquivo .env com os seguinte campos:
```js
EMAIL="seuemail@gmail.com"
SENHAEMAIL1="aaaa"
SENHAEMAIL2="bbbb"
SENHAEMAIL3="cccc"
SENHAEMAIL4="dddd"
SECRET_KEY='sua-senha-secreta'
```
- O e-mail será utilizado para enviar as mensagens de redefinir senha. O projeto está configurado para e-mails do tipo gmail.
- Com seu gmail acesse '[passwords.google.com](https://myaccount.google.com/apppasswords)' e gere uma senha para aplicativos.
- A senha será no formato 'aaaa bbbb cccc dddd'. Salve cada conjunto nas variaveis SENHAEMAIL1, SENHAEMAIL2, SENHAEMAIL3 e SENHAEMAIL4.

10. Rode o servidor Node.js::
 ```js
node server.js
 ```
Este README fornece uma visão geral do projeto ConectaONG, detalhando suas funcionalidades, tecnologias utilizadas e instruções para executar localmente.