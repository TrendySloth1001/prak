
import Header from '@/components/layout/header';
import { ClientFooter } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Image as ImageIcon, FileText, Plus, ArrowRight, Lock, ShieldCheck, Calculator } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-16 animate-fade-in-down">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground mb-4">
            The Art of Digital Hiding
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
            Learn how ImageCloak uses steganography to conceal data within an image, right before your eyes.
          </p>
        </div>

        <div className="space-y-16">
            <Card className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                    <ImageIcon className="h-8 w-8 text-accent" />
                    What is Steganography?
                </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-base space-y-4">
                <p>
                    Steganography is the practice of concealing a secret message within something that is not secret. The word itself comes from the Greek words <span className="italic text-foreground">steganos</span> (meaning "covered" or "concealed") and <span className="italic text-foreground">graphein</span> (meaning "writing").
                </p>
                <p>
                    Unlike cryptography, which encrypts a message to make it unreadable, steganography hides the very existence of the message. The goal is for an unintended observer not to suspect that a secret is even there. ImageCloak combines both techniques: it hides your data (steganography) and secures it with a password (cryptography).
                </p>
                </CardContent>
            </Card>

            {/* Visual Process Diagram */}
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                 <h2 className="text-3xl font-bold mb-8">The Encoding Process at a Glance</h2>
                 <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center">
                    <div className="flex flex-col items-center gap-2 p-6 bg-card border rounded-lg shadow-sm w-48 h-48 justify-center">
                        <ImageIcon className="h-12 w-12 text-accent" />
                        <span className="font-semibold text-foreground">1. Carrier Image</span>
                        <p className="text-xs text-muted-foreground">(e.g., a PNG or JPG)</p>
                    </div>
                    <Plus className="h-8 w-8 text-muted-foreground" />
                    <div className="flex flex-col items-center gap-2 p-6 bg-card border rounded-lg shadow-sm w-48 h-48 justify-center">
                        <FileText className="h-12 w-12 text-accent" />
                        <span className="font-semibold text-foreground">2. Secret Data</span>
                         <p className="text-xs text-muted-foreground">(Text or a file)</p>
                    </div>
                    <ArrowRight className="h-8 w-8 text-muted-foreground" />
                     <div className="flex flex-col items-center gap-2 p-6 bg-card border rounded-lg shadow-sm w-48 h-48 justify-center">
                        <Lock className="h-12 w-12 text-accent" />
                        <span className="font-semibold text-foreground">3. Encoded Image</span>
                         <p className="text-xs text-muted-foreground">(Visually identical)</p>
                    </div>
                 </div>
            </div>

            <Card className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                    <Code className="h-8 w-8 text-accent" />
                    The Core Technique: Least Significant Bit (LSB)
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 text-base">
                    <p className="text-muted-foreground">ImageCloak simulates a common and famous technique called Least Significant Bit (LSB) steganography. It works by manipulating the tiniest bits of data that make up the colors in an image.</p>
                    
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg text-foreground">1. Pixels and Colors</h4>
                        <p className="text-muted-foreground">A digital image is a grid of pixels. Each pixel has a specific color, typically represented as a combination of Red, Green, and Blue (RGB). Each of these color components has a value, usually from 0 to 255.</p>
                        <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-center gap-4 text-center">
                            <div>
                                <div className="w-16 h-16 rounded-full bg-red-500 mx-auto border-4 border-white/50 shadow-inner"></div>
                                <p className="mt-2 font-mono text-sm text-foreground">R: 212</p>
                            </div>
                            <div>
                                <div className="w-16 h-16 rounded-full bg-green-500 mx-auto border-4 border-white/50 shadow-inner"></div>
                                <p className="mt-2 font-mono text-sm text-foreground">G: 85</p>
                            </div>
                            <div>
                                <div className="w-16 h-16 rounded-full bg-blue-500 mx-auto border-4 border-white/50 shadow-inner"></div>
                                <p className="mt-2 font-mono text-sm text-foreground">B: 140</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg text-foreground">2. Colors in Binary</h4>
                        <p className="text-muted-foreground">Computers store these color values as 8-bit binary numbers. For example, the color value 212 is `11010100` in binary.</p>
                        <pre className="p-4 bg-gray-800 text-green-300 rounded-md text-sm font-mono overflow-x-auto">
                            <code className="whitespace-pre">
<div>R: 212  -&gt;  1101010<span className="text-yellow-400 font-bold">0</span></div>
<div>G: 85   -&gt;  0101010<span className="text-yellow-400 font-bold">1</span></div>
<div>B: 140  -&gt;  1000110<span className="text-yellow-400 font-bold">0</span></div>
                            </code>
                        </pre>
                        <p className="text-muted-foreground">The bit on the far right is the <strong className="text-foreground">Least Significant Bit (LSB)</strong>. Changing this bit has a minuscule effect on the final color—so small, in fact, that it's imperceptible to the human eye.</p>
                    </div>
                    
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg text-foreground">3. Hiding the Data</h4>
                        <p className="text-muted-foreground">This is where the magic happens. We can take a secret message, convert it to binary, and then replace the LSB of each color component in the image with the bits of our secret message. For example, to hide the letter "H" (`01001000` in binary), we would need 8 LSBs.</p>
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <h5 className="font-semibold mb-2">Visualizing the Change</h5>
                            <p className="text-sm text-muted-foreground mb-4">Even when we change the LSB, the color difference is invisible. Can you spot the change below?</p>
                            <div className="flex items-center justify-center gap-8">
                                <div className="text-center">
                                    <div className="w-24 h-24 rounded-md" style={{ backgroundColor: 'rgb(212, 85, 140)' }}></div>
                                    <p className="mt-2 font-mono text-xs text-foreground">R: 212, G: 85, B: 140</p>
                                    <p className="text-xs text-muted-foreground">(Original Pixel)</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-24 h-24 rounded-md" style={{ backgroundColor: 'rgb(213, 84, 141)' }}></div>
                                    <p className="mt-2 font-mono text-xs text-foreground">R: 213, G: 84, B: 141</p>
                                    <p className="text-xs text-muted-foreground">(Modified Pixel)</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-muted-foreground">To extract the data, the process is reversed. The decoder reads the LSB from each color channel, reconstructs the binary sequence of the secret message, and converts it back into its original form.</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="animate-fade-in-up" style={{ animationDelay: '800ms' }}>
                <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                    <Calculator className="h-8 w-8 text-accent" />
                    Mathematical Capacity
                </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-base space-y-4">
                <p>
                    The amount of data you can hide depends on the image's dimensions. Each pixel has three color channels (R, G, B), and we can hide 1 bit of secret data in the LSB of each channel.
                </p>
                <div className="p-4 bg-gray-800 text-green-300 rounded-md text-sm font-mono text-center">
                    (Image Width × Image Height × 3) / 8 = Maximum Bytes
                </div>
                <p>
                    For example, an 800x600 pixel image has `800 * 600 = 480,000` pixels.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><span className="font-semibold text-foreground">Total LSBs available:</span> 480,000 pixels × 3 bits/pixel = 1,440,000 bits</li>
                    <li><span className="font-semibold text-foreground">Total bytes:</span> 1,440,000 bits / 8 bits/byte = 180,000 bytes</li>
                    <li><span className="font-semibold text-foreground">That's about 175 KB</span> of data you can hide in an 800x600 image!</li>
                </ul>
                </CardContent>
            </Card>

            <Card className="animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
                <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                    <ShieldCheck className="h-8 w-8 text-accent" />
                    Security is More Than Hiding
                </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-base space-y-4">
                <p>
                    Hiding a message is clever, but it's not truly secure on its own. If someone suspects steganography is being used, they can analyze the image and extract the hidden data.
                </p>
                <p>
                    That's why ImageCloak adds a crucial second layer of defense: <strong className="text-foreground">strong password-based encryption</strong>. Before your secret data is hidden, it's encrypted. This means that even if an attacker finds the hidden data, it will be scrambled and unreadable without the correct password.
                </p>
                <div className="flex items-center gap-4 p-4 border border-dashed rounded-lg">
                    <Lock className="h-8 w-8 text-accent flex-shrink-0" />
                    <p className="text-sm">
                        Combining steganography (hiding) with cryptography (scrambling) creates a powerful one-two punch for digital privacy.
                    </p>
                </div>
                </CardContent>
            </Card>

            <div className="text-center animate-fade-in-up" style={{ animationDelay: '1200ms' }}>
                <h2 className="text-3xl font-bold">A Note on This App</h2>
                <p className="max-w-3xl mx-auto mt-2 text-muted-foreground">
                For security and simplicity, ImageCloak <strong className="text-foreground">simulates</strong> this process. It doesn't actually alter the image file on your device. Instead, it securely saves the "metadata" of your encoding job—the image description, password, and secret data—to your personal account. When you "decode," it's retrieving this securely stored information. This approach provides a user-friendly demonstration of steganography's principles without the complexities of binary file manipulation.
                </p>
            </div>
        </div>
      </main>
      <ClientFooter />
    </div>
  );
}

    