# Stark Overflow

**Stark Overflow** is a decentralized application (dApp) inspired by the concept of Stack Overflow, but with a financial incentive system. Using Starknet technology, this project allows users to ask questions and offer cryptocurrency rewards for the best answers.

## 🚀 Features

- Gamified question-and-answer system.
- Cryptocurrency deposits linked to each question.
- Additional contributions from other users to increase the reward.
- Automatic payment for the answer selected as the solution.
- Frontend built with **React** and **Typescript**.
- Smart Contracts written in **Cairo** for execution on Starknet.

## 📂 Project Structure

```
/stark_overflow
│
├── frontend/                                 # User interfaces
│   |── landing/                              # Landing page of the app
|   |
│   └── react/                                # The frontend of the app made in React
│       |── src/
│       |   |── @types
│       |   |── assets/                       # Images and icons
│       |   |── components/                   # Reusable components
│       |   |── hooks/                        # Custom hooks
│       |   |   |── useStatusMessage.ts       # Hook for managing status messages
│       |   |   └── useWallet.ts              # Hook for managing wallet connection
│       |   |── pages/                        # Main pages of the app
│       |   |   |── Home/                     # Main page of the app
│       |   |   |── Forum/                    # Page for viewing app's forums
│       |   |   |── QuestionPage/             # Page for asking a question
|       |   |   └── AnswerPage/               # Page for viewing answers to a question and give a new answer
│       |   |── providers/                    # General context providers for state management
│       |   |── services/                     # API services
│       |   |── styles/                       # Global styles and themes
│       |   └── utils/                        # Utility functions
│       |── App.tsx                           # Main application component
│       |── main.tsx                          # Entry point of the React app
|       └── router.tsx                        # Routes of the app
|
├── smartcontract/                            # Smart contracts written in Cairo
│   ├── src/                                  # Contract source code
│   │   ├── events.cairo                      # Event definitions
│   │   ├── lib.cairo                         # Entrypoint of the smart contract
│   │   ├── StarkOverflow.cairo               # Main contract logic
│   │   ├── structs.cairo                     # Struct definitions
│   │   |── types.cairo                       # Type definitions
│   |   └── tests/                            # Contract tests
│   │       ├── common.cairo                  # Common test functions
|   |       └── StarkOverflowTest.cairo       # Test cases for the main contract
│   └── Scarb.toml                            # Scarb project configuration
│
└── README.md                                 # General project documentation
```

## ⚙️ Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Scarb](https://docs.swmansion.com/scarb/) (for working with Cairo contracts)
- [Starknet CLI](https://book.starknet.io/)

### 1. Clone the repository
```bash
 git clone https://github.com/your-username/stark-overflow.git
 cd stark-overflow
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# or
yarn install
```

### 3. Smart Contracts Setup
```bash
cd smartcontract
scarb build
```

## 🔍 How to Use

### Starting the Frontend
```bash
cd frontend
npm start
# or
yarn start
```

### Running Smart Contract Tests
```bash
cd smartcontract
scarb test
```

### Deploying Contracts in Starknet Devnet
#### Linux:
<ol>
 <li>Install starknet-devnet. <a href="https://0xspaceshard.github.io/starknet-devnet/docs/running/install">tutorial</a></li>
 <li>Install starknet foundry. <a href="https://foundry-rs.github.io/starknet-foundry/getting-started/installation.html#linux-and-macos">tutorial</a></li>
 <li>Runs starknet-devnet with seed 0: <code>starknet-devnet seed=0</code></li>
 <ol type="I">
  <li><code>sncast --profile=devnet declare --contract-name=StarkOverflowToken</code></li>
  <li><code>sncast --profile=devnet declare --contract-name=StarkOverflow</code></li>
 </ol>
 <li>Deploy the contracts <a href="https://docs.starknet.io/quick-start/devnet/#deploying_hellostarknet_locally">tutorial</a></li>
 <ol type="I">
  <li><code>sncast --profile=devnet deploy --clash-hash=[StarkOverflowToken class hash] --salt=0 --arguments "'18', '100000000000000000000', [recipient address], [owner address], '1000000000000000000000'"</code></li>
  <li><code>sncast --profile=devnet deploy --clash-hash=[StarkOverflow class hash] --salt=0 --arguments "[StarkOverflowToken address]"</code></li>
 </ol>
</ol>

#### Windows:
<ol>
 <li>Install starknet-devnet via Docker. <a href="https://0xspaceshard.github.io/starknet-devnet/docs/running/docker">tutorial</a></li>
 <li>Install starknet foundry. <a href="https://foundry-rs.github.io/starknet-foundry/getting-started/installation.html#windows">tutorial</a></li>
 <li>Runs the container docker with starknet-devnet seed 0</li>
 <ol type="I">
  <li><code>sncast --profile=devnet declare --contract-name=StarkOverflowToken</code></li>
  <li><code>sncast --profile=devnet declare --contract-name=StarkOverflow</code></li>
 </ol>
 <li>Deploy the contracts <a href="https://docs.starknet.io/quick-start/devnet/#deploying_hellostarknet_locally">tutorial</a></li>
 <ol type="I">
  <li><code>sncast --profile=devnet deploy --clash-hash=[StarkOverflowToken class hash] --salt=0 --arguments "'18', '100000000000000000000', [recipient address], [owner address], '1000000000000000000000'"</code></li>
  <li><code>sncast --profile=devnet deploy --clash-hash=[StarkOverflow class hash] --salt=0 --constructor-calldata=[StarkOverflowToken address]</code></li>
 </ol>
</ol>

## 🛠️ Technologies Used

- **React.js**
- **Typescript**
- **Styled-Components**
- **Cairo** (Starknet Language)
- **Scarb** (Package manager for Cairo projects)

## 🤝 Contribution

1. Fork the project
2. Create a branch (`git checkout -b feature/MyFeature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/MyFeature`)
5. Open a Pull Request to the development branch

## 📜 License

This project is licensed under the [MIT License](LICENSE).

## 📧 Contact

Müller Esposito Nunes  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin)]([https://www.linkedin.com/in/seu-usuario](https://linkedin.com/in/mulleresposito))
[![Email](https://img.shields.io/badge/Email-red?style=for-the-badge&logo=gmail&logoColor=white)](mailto:mulleresposito@hotmail.com)

Community

[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)]([https://t.me/seu_usuario](https://t.me/starkoverflow))
