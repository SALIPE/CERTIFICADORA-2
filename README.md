# CERTIFICADORA-2
<h1 align="center">
    Projeto Furiosos Kids  ( Certificadora Da Competência 2 )
</h1>

<p align="center">
    <img loading="lazy" src="https://github.com/SALIPE/CERTIFICADORA-2/blob/main/frontend/src/assets/css/images/icon.png?raw=true" alt="Logotipo do projeto Furiosos Kids" width="700">
</p>

<p align="center">
   Uma plataforma web dedicada à gestão operacional e divulgação do projeto Furiosos Kids.
</p>

<p align="center">
    <img loading="lazy" src="http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge"/>
</p>

---

## 📚 Sobre o Projeto


O **Furiosos Kids** é um projeto de extensão vinculado à equipe de cheerleading da UTFPR-CP, criado em 2018 com o objetivo de oferecer aulas especializadas de cheerleading para crianças da comunidade externa, promovendo inclusão, desenvolvimento social, disciplina e integração com o ambiente universitário.

Este sistema está sendo desenvolvido como parte da disciplina **EC46H - Certificadora da Competência 2**, do curso de Engenharia de Computação da UTFPR, com a proposta de modernizar e digitalizar os processos administrativos e pedagógicos do projeto.

Atualmente, grande parte da gestão do Furiosos Kids é realizada manualmente, utilizando registros em papel para controle de frequência, cadastro de alunos, responsáveis, voluntários e organização das aulas. Isso gera problemas como:

- Alto risco de perda de informações históricas;
- Dificuldade de organização dos dados;
- Processos burocráticos e demorados;
- Falta de relatórios estatísticos confiáveis;
- Dificuldade para elaboração de propostas de patrocínio e relatórios de impacto social.

A plataforma proposta busca centralizar todas essas informações em um ambiente digital seguro, organizado e acessível.

---

## ✨ Funcionalidades

A plataforma Furiosos Kids contará com módulos voltados à gestão administrativa e pedagógica do projeto, incluindo:

* **Gestão de Alunos:** Cadastro completo dos alunos participantes do projeto.
* **Gestão de Responsáveis:** Controle de responsáveis vinculados aos alunos.
* **Gestão de Voluntários:** Cadastro e gerenciamento dos acadêmicos voluntários.
* **Controle de Frequência:** Registro rápido e organizado da presença dos alunos nas aulas.
* **Gestão de Aulas:** Organização das turmas, horários e atividades realizadas.
* **Gestão de Eventos:** Controle de participação em eventos e competições.
* **Histórico de Participação:** Armazenamento de dados históricos de frequência e desempenho.
* **Sistema de Busca e Filtragem:** Consulta eficiente de alunos, responsáveis, voluntários e registros.
* **Relatórios Estatísticos:** Geração de dados quantitativos para apoio em relatórios, editais e patrocínios.
* **Divulgação do Projeto:** Área institucional para apresentação do Furiosos Kids à comunidade.

---

## 🚀 Como Rodar

O projeto requer instalação de dependências. Para visualizar o site:

---

## 💻 Tecnologias Utilizadas

* **HTML5:** Para a estruturação semântica do conteúdo das páginas.
* **CSS3:** Para a estilização e o design responsivo das interfaces.
* **React JS:**
* **Bootstrap:**
* **Swagger:**
* **Typescript:**

---

## 📁 Estrutura do Projeto
```
CERTIFICADORA-2/
├── .gitignore
├── .vscode/
│   └── settings.json
├── backend/
│   ├── .dockerignore
│   ├── .gitignore
│   ├── .mvn/
│   │   └── wrapper/
│   │       ├── maven-wrapper.jar
│   │       └── maven-wrapper.properties
│   ├── build.bat
│   ├── build.sh
│   ├── Dockerfile.build
│   ├── Dockerfile.run
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── nbactions.xml
│   ├── pom.xml
│   ├── README.md
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/
│       │   │       └── furiosos/
│       │   │           ├── auth/
│       │   │           │   └── AuthJjwt.java
│       │   │           ├── config/
│       │   │           │   ├── JwtFilter.java
│       │   │           │   └── SwaggerConfig.java
│       │   │           ├── controllers/
│       │   │           │   ├── AulaController.java
│       │   │           │   ├── MatriculaAlunoController.java
│       │   │           │   ├── PresencaAlunoController.java
│       │   │           │   ├── TurmaController.java
│       │   │           │   └── UserController.java
│       │   │           ├── dto/
│       │   │           │   ├── AulaDTO.java
│       │   │           │   ├── LoginRequestDTO.java
│       │   │           │   ├── LoginResponseDTO.java
│       │   │           │   ├── MatriculaAlunoDTO.java
│       │   │           │   ├── PresencaAlunoDTO.java
│       │   │           │   ├── TurmaDTO.java
│       │   │           │   └── UsuarioDTO.java
│       │   │           ├── exceptions/
│       │   │           │   ├── ApiException.java
│       │   │           │   ├── ApiExceptionHandler.java
│       │   │           │   └── ApiRequestException.java
│       │   │           ├── FuriososApplication.java
│       │   │           ├── models/
│       │   │           │   ├── Aula.java
│       │   │           │   ├── MatriculaAluno.java
│       │   │           │   ├── PresencaAluno.java
│       │   │           │   ├── Turma.java
│       │   │           │   └── User.java
│       │   │           ├── repository/
│       │   │           │   ├── AulaRepository.java
│       │   │           │   ├── MatriculaAlunoRepository.java
│       │   │           │   ├── PresencaAlunoRepository.java
│       │   │           │   ├── TurmaRepository.java
│       │   │           │   └── UserRepository.java
│       │   │           ├── services/
│       │   │           │   ├── AulaService.java
│       │   │           │   ├── AuthService.java
│       │   │           │   ├── MatriculaAlunoService.java
│       │   │           │   ├── PresencaAlunoService.java
│       │   │           │   ├── TurmaService.java
│       │   │           │   └── UserService.java
│       │   │           └── utils/
│       │   │               └── AuthUtils.java
│       │   └── resources/
│       │       └── application.properties
│       └── test/
│           └── java/
│               └── com/
│                   └── furiosos/
│                       └── ApirestApplicationTests.java
├── docker-compose.yml
├── erd.png
├── frontend/
│   ├── .gitignore
│   ├── Dockerfile
│   ├── package-lock.json
│   ├── package.json
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── App.tsx
│   │   ├── assets/
│   │   │   └── css/
│   │   │       ├── AdminDashboard.css
│   │   │       ├── Auth.css
│   │   │       ├── images/
│   │   │       │   ├── 2.png
│   │   │       │   ├── icon.png
│   │   │       │   └── login-image.png
│   │   │       ├── Index.css
│   │   │       └── LandingPage.css
│   │   ├── components/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/
│   │   │   └── UserContext.tsx
│   │   ├── index.tsx
│   │   ├── layouts/
│   │   │   ├── Admin.js
│   │   │   └── AlunosLayout.js
│   │   ├── react-app-env.d.ts
│   │   ├── services/
│   │   │   └── WebService.js
│   │   ├── telas/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   └── AulaCreateEdit.tsx
│   │   │   ├── alunos/
│   │   │   │   └── TurmasMatriculadas.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   └── Login.tsx
│   │   ├── types/
│   │   │   ├── Aula.ts
│   │   │   ├── Turma.ts
│   │   │   └── Usuario.ts
│   │   └── utils/
│   │       └── Functions.js
│   └── tsconfig.json
├── LICENSE
├── README.md
└── tabelas.sql

```

# 👥 Integrantes e Contribuições

Este projeto foi desenvolvido por:

* Bruna Aika Kiyono — RA: 2052482
* Felipe Bueno de Souza — RA: 2266350
* Thiago Henrique Rodrigues Arakaki — RA: 2261286

---

## 🔗 Links

* **Repositório no GitHub:** [**`[https://github.com/SALIPE/CERTIFICADORA-2.git]`**](`https://github.com/SALIPE/CERTIFICADORA-2.git`)
* **Vídeo de Apresentação (YouTube):** [**`[]`**](`[]`)

---

## 📄 Licença

Este projeto acadêmico não possui uma licença formal de código aberto, mas é destinado à divulgação de uma proposta de plataforma. O conteúdo e a ideia podem ser utilizados como inspiração, com a devida citação.

---
