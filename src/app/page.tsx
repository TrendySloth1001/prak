
import Header from '@/components/layout/header';
import { ClientFooter } from '@/components/layout/footer';
import ImageCloak from '@/components/features/image-cloak';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, FilePlus, DownloadCloud } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const features = [
  {
    icon: <Lock className="h-10 w-10 text-primary" />,
    title: 'Secure Encryption',
    description: 'Protect your hidden data with strong, password-based encryption. Only you and those you trust can reveal the secret.',
  },
  {
    icon: <FilePlus className="h-10 w-10 text-primary" />,
    title: 'Text & File Support',
    description: 'Embed anything from a simple text message to important documents or files directly within your image carrier.',
  },
  {
    icon: <DownloadCloud className="h-10 w-10 text-primary" />,
    title: 'Easy to Use',
    description: 'A simple, two-step process for both encoding and decoding. No complex software or technical knowledge required.',
  },
];

const faqs = [
  {
    question: 'What is steganography?',
    answer: 'Steganography is the practice of concealing a file, message, image, or video within another file, message, image, or video. ImageCloak uses this technique to hide your data inside an image file.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. ImageCloak uses password-based encryption to secure your data. Without the correct password, it is computationally infeasible to extract the hidden information.'
  },
  {
    question: 'What happens if I forget my password?',
    answer: 'If you forget your password, the data hidden within the image cannot be recovered. There is no password recovery mechanism, so be sure to store your password in a safe place.'
  },
  {
    question: 'What file types are supported?',
    answer: 'You can use common image formats like PNG, JPG, and GIF as carrier images. For the secret data, you can hide both plain text and any type of file.'
  }
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 text-center animate-fade-in-down">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground mb-4">
              Hide Secrets in Plain Sight
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
              ImageCloak uses steganography to let you embed secret messages or files within ordinary images. Secure, simple, and powerful.
            </p>
            <Button size="lg" asChild>
              <a href="#app">
                Try ImageCloak Now <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {features.map((feature, index) => (
                <div key={index} className="p-6 bg-background rounded-lg shadow-sm animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* App Section */}
        <section id="app" className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <ImageCloak />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 max-w-3xl">
             <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                 <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <ClientFooter />
    </div>
  );
}
