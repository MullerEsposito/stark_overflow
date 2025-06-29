# Stark Overflow Frontend

This is the frontend of the **Stark Overflow** project, a decentralized application (dApp) that allows users to ask questions and offer cryptocurrency rewards for the best answers. This frontend was developed using **React** and **TypeScript**.

## 📦 Project Structure

```
react/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── providers/
│   ├── scripts/
│   ├── services/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── router.tsx
├── .env
├── package.json
├── tsconfig.json
└── ...
```

- `public/`: Contains the `index.html` file and other public resources.
- `src/`: Main source code directory.
  - `assets/`: Static resources such as images and fonts.
  - `components/`: Reusable UI components.
  - `hooks/`: Custom hooks for state management and other functionalities.
  - `pages/`: Application pages.
  - `providers/`: Modules for API communication and other functionalities.
  - `scripts/`: Custom scripts for the application.
  - `services/`: Modules for API communication and other functionalities.
  - `styles/`: Application styles.
  - `types/`: TypeScript types for the application.
  - `utils/`: Utility functions for the application.
  - `App.tsx`: Root component of the application.
  - `main.tsx`: React entry point.
  - `router.tsx`: React router configuration.

## 🛠️ Technologies Used

- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Superset of JavaScript that adds static typing.
- **Styled-Components**: Library for styling components.
- **Axios**: HTTP client for making API requests.

## ⚙️ Installation and Execution

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or later
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)

### Steps to run the project

1. **Clone the repository**

   ```bash
   git clone https://github.com/MullerEsposito/stark_overflow.git
   cd stark_overflow/frontend/react
   ```

2. **Install dependencies**

   ```bash
   # Using Yarn
   yarn install

   # Or using npm
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory of `react/` and define the necessary variables. For example:

   ```env
   VITE_CONTRACT_ADDRESS=0x0228432fe63e8808fd694c8c80f6266a735c340760812f64fe20b015d2b2700e
   ```

   Adjust the variables according to your environment needs.

4. **Start the application**

   ```bash
   # Using Yarn
   yarn start

   # Or using npm
   npm start
   ```

   The application will be available at `http://localhost:3000`.

## 🚀 Main Scripts

In the project directory, you can run:

- `yarn dev` or `npm dev`: Starts the development server.
- `yarn test` or `npm test`: Runs the application tests.

## 🤝 Contributing

1. Fork the project.
2. Create a branch for your feature (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for more details.

### 📞 Contact

For questions or suggestions, feel free to reach out:

---

#### **Müller Esposito Nunes**  
🔗 [LinkedIn](https://linkedin.com/in/mulleresposito)  
✉️ [mulleresposito@hotmail.com](mailto:mulleresposito@hotmail.com)

---

#### **Arnaelcio Gomes Pereira**  
🔗 [LinkedIn](https://linkedin.com/in/arnaelciogomespereira)  
✉️ [arnaelcio@gmail.com](mailto:arnaelcio@gmail.com)
