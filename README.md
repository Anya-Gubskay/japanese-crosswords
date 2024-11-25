# 🀄 Angular Japanase games

**Japanese games** is a Japanese board game created using Angular. They are designed to be lightweight, responsive and user-friendly, providing a fun experience for players of all ages.

---

## 🚀 Live Demo

Check out the live version of the app here:  
👉 [https://japanese-crosswords.web.app](https://japanese-crosswords.web.app)  

---

## 🛠️ Features

- 🎮 **Easy Controls**: Intuitive and easy-to-learn controls for all players.
- 🎨 **Japanese-Chinese Design**: A unique design inspired by Japanese and Chinese cultures, enhancing the game's atmosphere.
- 💾 **Save Game Progress**: Game progress is automatically saved, even if the page is reloaded.
- 📱 **Interactive Videos**: Each level selection is accompanied by atmospheric and engaging videos.
- 🌐 **Hints System**: Integrated tips to help players complete puzzles faster.


---

## 📦 Installation

To run the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Anya-Gubskay/japanese-crosswords.git
   cd japanase-crossword
 2. **Install dependencies:**
    ```bash
    npm install

 3. **Run the development server:**
    ```bash
    ng serve

 4. Open your browser and navigate to http://localhost:4200/.

 ## 🏗️ Build

 To build the project for production:

    ng build --prod

The production-ready files will be stored in the dist/browser.

## 🧪 Testing

  **Unit Tests**

  Run unit tests with:
 
    ng test

## 🎨 Tech Stack

- **Frontend**: Angular 19, Tailwind CSS
- **State Management**: Signals (introduced in Angular 16)

## 📚 Folder Structure

The project is organized in the following structure to ensure modularity and maintainability:

```plaintext
src/
├── app/
│   ├── components/     # Reusable components
│   ├── constants/      # Constants
│   ├── directives/     # Custom directives
│   ├── enums/          # Enums for defining fixed values
│   ├── interfaces/     # TypeScript interfaces
│   ├── pages/          # All application pages
│   ├── services/       # Application services
│   └── utils/          # Utility functions
├── assets/             # Static assets (images, icons, videos, etc.)
   
