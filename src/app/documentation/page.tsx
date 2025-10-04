
import Header from '@/components/layout/header';
import { ClientFooter } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, FileCode, CheckSquare, Server, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function DocumentationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-16 animate-fade-in-down">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground mb-4">
            Project Documentation
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
            A complete guide to setting up and running ImageCloak in your local environment.
          </p>
        </div>

        <div className="space-y-12 max-w-4xl mx-auto">
            <Card className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                    <LinkIcon className="h-8 w-8 text-accent" />
                    ImageCloak
                </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-base space-y-4">
                <p>
                    ImageCloak is a web application that demonstrates the principles of steganography—the art of hiding secret data within an ordinary image. It provides a user-friendly interface to "embed" a secret message or a file into a carrier image, protected by a password.
                </p>
                <p>
                    This application simulates the steganography process for a secure and smooth user experience in a web environment. Instead of performing complex binary manipulation on the client-side, it securely stores the encoding metadata (image, secret data, password) in the user's personal Firebase account.
                </p>
                 <Link href="https://github.com/TrendySloth1001/prak#" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    View on GitHub &rarr;
                </Link>
                </CardContent>
            </Card>

            <Card className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                    <Server className="h-8 w-8 text-accent" />
                    Tech Stack
                </CardTitle>
                </CardHeader>
                <CardContent className="text-base space-y-2">
                    <ul className="list-disc pl-5 text-muted-foreground">
                        <li><strong>Framework:</strong> Next.js (App Router)</li>
                        <li><strong>Styling:</strong> Tailwind CSS</li>
                        <li><strong>UI Components:</strong> shadcn/ui</li>
                        <li><strong>Backend & Auth:</strong> Firebase (Authentication & Firestore)</li>
                        <li><strong>AI Features:</strong> Google AI & Genkit</li>
                        <li><strong>Deployment:</strong> Firebase App Hosting</li>
                    </ul>
                </CardContent>
            </Card>

            <Card className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                    <CheckSquare className="h-8 w-8 text-accent" />
                    Prerequisites
                </CardTitle>
                </CardHeader>
                <CardContent className="text-base space-y-2">
                     <ul className="list-disc pl-5 text-muted-foreground">
                        <li>Node.js (v18 or later recommended)</li>
                        <li>`npm` (or another package manager like `yarn` or `pnpm`)</li>
                        <li>A <Link href="https://console.firebase.google.com/" target='_blank' className='text-accent hover:underline'>Firebase Project</Link> with <strong>Authentication</strong> (Google provider enabled) and <strong>Firestore</strong> enabled.</li>
                    </ul>
                </CardContent>
            </Card>

            <Card className="animate-fade-in-up" style={{ animationDelay: '800ms' }}>
                <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                    <FileCode className="h-8 w-8 text-accent" />
                    Environment Setup
                </CardTitle>
                </CardHeader>
                <CardContent className="text-base space-y-6">
                    <div>
                        <h4 className="font-bold text-lg mb-2 text-foreground">1. Install Dependencies</h4>
                        <p className='text-muted-foreground mb-2'>First, navigate to the project directory and install the required `npm` packages.</p>
                        <pre className="p-4 bg-gray-800 text-green-300 rounded-md text-sm font-mono overflow-x-auto">
                            <code>npm install</code>
                        </pre>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-2 text-foreground">2. Set Up `.env` File</h4>
                        <p className="text-muted-foreground mb-4">
                            You'll need to connect the app to a Firebase project. Create a file named `.env` in the project root and copy the example below.
                        </p>
                        <pre className="p-4 bg-gray-800 text-gray-300 rounded-md text-sm font-mono overflow-x-auto">
{`# Firebase Project Configuration
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-firebase-project-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-firebase-app-id"
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-firebase-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-firebase-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"

# Optional: Display builder names in the footer (comma-separated)
NEXT_PUBLIC_BUILDERS="NIKHIL KUMAWAT,Your Name"`}
                        </pre>
                    </div>

                     <div>
                        <h4 className="font-bold text-lg mb-2 text-foreground">3. Get Firebase Credentials</h4>
                        <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
                           <li>Go to the <Link href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-semibold">Firebase Console</Link>.</li>
                           <li>Click on **"Add project"** or select an existing project.</li>
                           <li>Once your project is open, navigate to **Project Settings** by clicking the gear icon <code className="bg-muted/50 text-foreground p-1 rounded-sm">⚙️</code> next to "Project Overview".</li>
                           <li>In the "Your apps" card, click on the **Web icon** (<code className="bg-muted/50 text-foreground p-1 rounded-sm">&lt;/&gt;</code>) to register a new web app.</li>
                           <li>Give your app a nickname (e.g., "ImageCloak App") and click **"Register app"**. You can skip the "Add Firebase SDK" step.</li>
                           <li>After registration, you will be taken back to the Project Settings page. In the "Your apps" card, find the **SDK setup and configuration** section and select **"Config"**.</li>
                           <li>You will see a <code className="bg-muted/50 text-foreground p-1 rounded-sm">firebaseConfig</code> object. This contains all the credentials you need. Copy the values from this object into your <code className="bg-muted/50 text-foreground p-1 rounded-sm">.env</code> file.
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li>Copy the <code className="bg-muted/50 text-foreground p-1 rounded-sm">apiKey</code> value and paste it into <code className="bg-muted/50 text-foreground p-1 rounded-sm">NEXT_PUBLIC_FIREBASE_API_KEY</code>.</li>
                                <li>Copy the <code className="bg-muted/50 text-foreground p-1 rounded-sm">authDomain</code> value and paste it into <code className="bg-muted/50 text-foreground p-1 rounded-sm">NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</code>.</li>
                                <li>Copy the <code className="bg-muted/50 text-foreground p-1 rounded-sm">projectId</code> value and paste it into <code className="bg-muted/50 text-foreground p-1 rounded-sm">NEXT_PUBLIC_FIREBASE_PROJECT_ID</code>.</li>
                                <li>Copy the <code className="bg-muted/50 text-foreground p-1 rounded-sm">storageBucket</code> value and paste it into <code className="bg-muted/50 text-foreground p-1 rounded-sm">NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</code>.</li>
                                <li>Copy the <code className="bg-muted/50 text-foreground p-1 rounded-sm">messagingSenderId</code> value and paste it into <code className="bg-muted/50 text-foreground p-1 rounded-sm">NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</code>.</li>
                                <li>Copy the <code className="bg-muted/50 text-foreground p-1 rounded-sm">appId</code> value and paste it into <code className="bg-muted/50 text-foreground p-1 rounded-sm">NEXT_PUBLIC_FIREBASE_APP_ID</code>.</li>
                            </ul>
                           </li>
                        </ol>
                    </div>
                </CardContent>
            </Card>

            <Card className="animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-3xl">
                        <Terminal className="h-8 w-8 text-accent" />
                        Running Locally
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-base space-y-6">
                    <div>
                        <h4 className="font-bold text-lg mb-2 text-foreground">Run the Development Server</h4>
                        <p className='text-muted-foreground mb-2'>This command starts the main Next.js application.</p>
                        <pre className="p-4 bg-gray-800 text-green-300 rounded-md text-sm font-mono overflow-x-auto">
                            <code>npm run dev</code>
                        </pre>
                        <p className="text-muted-foreground mt-2">The app will be available at <Link href="http://localhost:9002" target="_blank" className="text-accent hover:underline">http://localhost:9002</Link>.</p>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-2 text-foreground">Run the Genkit AI Flows</h4>
                        <p className='text-muted-foreground mb-2'>To use the AI features (like image analysis), you must run the Genkit server in a separate terminal.</p>
                        <pre className="p-4 bg-gray-800 text-green-300 rounded-md text-sm font-mono overflow-x-auto">
                            <code>npm run genkit:watch</code>
                        </pre>
                    </div>
                </CardContent>
            </Card>

        </div>
      </main>
      <ClientFooter />
    </div>
  );
}
