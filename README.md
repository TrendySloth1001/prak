# ImageCloak

ImageCloak is a web application that demonstrates the principles of steganography—the art of hiding secret data within an ordinary image. It provides a user-friendly interface to "embed" a secret message or a file into a carrier image, protected by a password.

This application simulates the steganography process for a secure and smooth user experience in a web environment. Instead of performing complex binary manipulation on the client-side, it securely stores the encoding metadata (image, secret data, password) in the user's personal Firebase account.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Backend & Auth**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **AI Features**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
- **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

---

## Getting Started

Follow these instructions to set up and run the project in your local development environment.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- `npm` (or another package manager like `yarn` or `pnpm`)
- A [Firebase Project](https://console.firebase.google.com/) with **Authentication** (Google provider enabled) and **Firestore** enabled.

### 1. Install Dependencies

First, navigate to the project directory and install the required `npm` packages.

```bash
npm install
```

### 2. Set Up Environment Variables

This project requires a connection to a Firebase project to handle user authentication and data storage.

1.  Create a new file named `.env` in the root of the project.
2.  Copy the contents of the example below into your new `.env` file.
3.  Go to your [Firebase Project Settings](https://console.firebase.google.com/u/0/project/_/settings/general/) and find your web app's configuration values to fill in the variables.

#### `.env` example:

```env
# Firebase Project Configuration
# Get these from your Firebase project settings > web app config
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-firebase-project-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-firebase-app-id"
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-firebase-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-firebase-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"

# Optional: Display builder names in the footer (comma-separated)
NEXT_PUBLIC_BUILDERS="NIKHIL KUMAWAT,Your Name"
```

### 3. Running the Development Server

Once the dependencies are installed and the environment variables are set, you can run the local development server.

```bash
npm run dev
```

The application will start, and you can view it in your browser at `http://localhost:9002` (or another port if `9002` is in use).

### 4. Running Genkit Flows (for AI features)

The AI features (like image analysis) are powered by Genkit. To test and develop these flows locally, run the following command in a separate terminal:

```bash
npm run genkit:watch
```

This starts the Genkit development server, allowing the Next.js app to communicate with your AI flows.

---

## Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Creates a production build of the application.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase for errors.
- `npm run genkit:dev`: Starts the Genkit development server once.
- `npm run genkit:watch`: Starts the Genkit server in watch mode.
