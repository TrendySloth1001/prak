# ImageCloak

ImageCloak is a web application that demonstrates the principles of steganography—the art of hiding secret data within an ordinary image. It provides a user-friendly interface to "embed" a secret message or a file into a carrier image, protected by a password.

This application simulates the steganography process for a secure and smooth user experience in a web environment. Instead of performing complex binary manipulation on the client-side, it securely stores the encoding metadata (image, secret data, password) in the user's personal Firebase account.

**GitHub Repository**: [https://github.com/TrendySloth1001/prak#](https://github.com/TrendySloth1001/prak#)

---

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

#### A. Create the `.env` File
Create a new file named `.env` in the root of the project and copy the contents of the example below into it.

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

#### B. Get Your Firebase Credentials
Follow these steps to get the values for the `.env` file from the Firebase console.

1.  Go to the **[Firebase Console](https://console.firebase.google.com/)**.
2.  Click on **"Add project"** or select a project you already have.
3.  Once your project is open, go to **Project Settings** by clicking the gear icon `⚙️` next to "Project Overview" in the left sidebar.
4.  In the "General" tab, scroll down to the **"Your apps"** card.
5.  Click on the **Web icon (`</>`)** to create and register a new web app.
6.  Give your app a nickname (e.g., "ImageCloak App") and click **"Register app"**.
7.  After registering, you will be taken back to the Project Settings page. In the "Your apps" card, find the **"SDK setup and configuration"** section and select the **"Config"** radio button.
8.  You will see a `firebaseConfig` object. This contains all the credentials you need.
    - Copy the `apiKey` value and paste it into `NEXT_PUBLIC_FIREBASE_API_KEY` in your `.env` file.
    - Copy the `authDomain` value and paste it into `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`.
    - Do this for all the required Firebase variables in your `.env` file.

### 3. Running the Development Server

Once the dependencies are installed and the environment variables are set, you can run the local development server.

```bash
npm run dev
```

The application will start, and you can view it in your browser at `http://localhost:9002` (or another port if `9002` is in use).

### 4. Running Genkit Flows (for AI features)

The AI features (like image analysis) are powered by Genkit. To test and develop these flows locally, you must run the Genkit server in a **separate terminal**.

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
