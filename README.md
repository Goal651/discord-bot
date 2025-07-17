# Discord Bot Project

A modern web client for interacting with your Discord bot, built with Next.js, React, and TypeScript. This project provides a user-friendly interface to communicate with your bot, view messages, and manage your Discord integration.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Discord OAuth2 Authentication**
- **Real-time Messaging** via WebSockets
- **Responsive UI** for desktop and mobile
- **Message Formatting** and display
- **Connection Status Indicator**
- **Toast Notifications** for errors and events
- **Sidebar Navigation**

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/) or [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/discord-bot-client.git
   cd discord-bot-client/client
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your Discord credentials and API endpoints.

---

## Configuration

Create a `.env.local` file in the `client` directory with the following variables:

```env
NEXT_PUBLIC_DISCORD_CLIENT_ID=your_discord_client_id
NEXT_PUBLIC_DISCORD_REDIRECT_URI=your_redirect_uri
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
```

Adjust these as needed for your deployment.

---

## Usage

- **Start the development server:**
  ```bash
  pnpm dev
  # or
  npm run dev
  # or
  yarn dev
  ```
- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Log in with your Discord account and interact with your bot.

---

## Project Structure

```
client/
  api/            # API service and constants
  app/            # Next.js app directory (pages, layouts)
  components/     # React components (UI, Sidebar, MessageList, etc.)
  context/        # React context providers (e.g., Socket)
  hooks/          # Custom React hooks
  lib/            # Utility libraries (message formatting, etc.)
  styles/         # Global and component styles
  types/          # TypeScript type definitions
```

---

## Deployment

This project is ready to deploy on [Vercel](https://vercel.com/) or any platform supporting Next.js.

- **Deploy on Vercel:**
  [![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/goal651s-projects/v0-discord-bot-project)

- **Live Project:**
  [https://vercel.com/goal651s-projects/v0-discord-bot-project](https://vercel.com/goal651s-projects/v0-discord-bot-project)

---

## Contributing

Contributions are welcome! Please open issues or pull requests for improvements, bug fixes, or new features.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
