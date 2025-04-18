# Template Overview

A FBI Wanted Dashboard  [Live](https://wanted.stacq.app)

## Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

## Local Development

1. **Clone the repository:**

   ```sh
   git clone https://github.com/danielh4t/fbi.git
   cd fbi
   ```

2. **Install dependencies:**

   ```sh
   pnpm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root with:

   ```
   GITHUB_ID=your_github_client_id
   GITHUB_SECRET=your_github_client_secret
   NEXTAUTH_SECRET=your_random_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server:**

   ```sh
   pnpm dev
   ```

   Visit [http://localhost:3000](http://localhost:3000).

## Running with Docker

1. **Build the Docker image:**

   ```sh
   docker build -t fbi .
   ```

2. **Run the container:**

   ```sh
   docker run -p 3000:3000 --env-file .env.local fbi
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

## Testing

```sh
pnpm test
```

## Linting

```sh
pnpm lint
```

---

## Features

- React, Next
- Tailwind CSS
- Authentication with GitHub login
- pnpm for fast installs
- Docker-ready

---
