# Discord Message Streamer

A full-stack app that streams messages from a Discord channel to a web frontend in real time. Built for the Railway Senior Full-Stack Engineer - Support interview project.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Design Decisions & Improvements](#design-decisions--improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Real-time Streaming** of Discord messages from any channel
- **Channel Selection** and live updates
- **Responsive UI** for desktop and mobile
- **Message Formatting** and display (with attachments)
- **Connection Status Indicator**
- **Toast Notifications** for errors and events
- **Sidebar Navigation**
- **Support-oriented design**: clear error states, connection feedback, and user guidance

---

## Architecture

- **Backend:** Node.js server with a Discord bot, relays messages via WebSocket
- **Frontend:** Next.js app (React, TypeScript) connects to backend via socket.io
- **Deployment:** Both backend and frontend deployed on Railway

```mermaid
graph TD
  "Discord"-->|"Bot"|"Backend"-->|"WebSocket"|"Frontend"
```

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

```sh
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

This project is ready to deploy on [Railway](https://railway.app/).

- **Deploy on Railway:**
  1. Connect your repository to Railway.
  2. Set the required environment variables in the Railway dashboard.
  3. Deploy both backend and frontend services.
- **Live Project:**
  - [Your Railway Deployment URL Here]

---

## Design Decisions & Improvements

- Used socket.io for real-time updates for simplicity and reliability.
- Grouped messages from the same user for better readability.
- Support-oriented: clear error states, connection feedback, and user guidance.
- (Optional) If you want to scale, consider message pagination, advanced error handling, or a richer support dashboard.

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
