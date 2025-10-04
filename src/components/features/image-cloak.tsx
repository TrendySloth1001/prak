
"use client";

import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, File as FileIcon, KeyRound, Download, Loader2, Unplug, ShieldCheck, FileText, X, Wand2, RefreshCw, Palette } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from '@/firebase';
import { signInWithGoogle } from '@/firebase/auth/auth-helpers';
import { saveEncodedImage } from '@/firebase/auth/user';
import { cn } from '@/lib/utils';

type DataType = 'text' | 'file';
type DecodedDataType = { type: 'text'; content: string } | { type: 'file'; content: File };
type CarrierSource = 'upload' | 'random';
type FilterType = 'original' | 'grayscale' | 'sepia';


export default function ImageCloak() {
  const { toast } = useToast();
  const { user, firestore } = useFirebase();

  const [carrierImage, setCarrierImage] = useState<File | null>(null);
  const [carrierPreview, setCarrierPreview] = useState<string | null>(null);
  const [dataType, setDataType] = useState<DataType>('text');
  const [secretText, setSecretText] = useState('');
  const [secretFile, setSecretFile] = useState<File | null>(null);
  const [encodePassword, setEncodePassword] = useState('');
  const [isEncoding, setIsEncoding] = useState(false);
  const [encodedImage, setEncodedImage] = useState<string | null>(null);

  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [decodePassword, setDecodePassword] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodedData, setDecodedData] = useState<DecodedDataType | null>(null);
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const [decodedFileUrl, setDecodedFileUrl] = useState<string | null>(null);

  const [carrierSource, setCarrierSource] = useState<CarrierSource>('upload');
  const [isGenerating, setIsGenerating] = useState(false);
  const [carrierDescription, setCarrierDescription] = useState('');
  
  const [activeFilter, setActiveFilter] = useState<FilterType>('original');
  const canvasRef = useRef<HTMLCanvasElement>(null);


  useEffect(() => {
    return () => {
      if (carrierPreview) URL.revokeObjectURL(carrierPreview);
      if (sourcePreview) URL.revokeObjectURL(sourcePreview);
      if (encodedImage) URL.revokeObjectURL(encodedImage);
      if (decodedFileUrl) URL.revokeObjectURL(decodedFileUrl);
    };
  }, [carrierPreview, sourcePreview, encodedImage, decodedFileUrl]);
  
  const applyFilterToCanvas = (image: HTMLImageElement, filter: FilterType) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    if (filter === 'grayscale') {
      ctx.filter = 'grayscale(100%)';
    } else if (filter === 'sepia') {
      ctx.filter = 'sepia(100%)';
    } else {
      ctx.filter = 'none';
    }

    ctx.drawImage(image, 0, 0);
  };
  
  const handleFilterChange = (filter: FilterType) => {
    if (!carrierPreview) return;
    setActiveFilter(filter);
    const img = document.createElement('img');
    img.crossOrigin = 'anonymous';
    img.src = carrierPreview;
    img.onload = () => {
      applyFilterToCanvas(img, filter);
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            const filteredFile = new File([blob], carrierImage?.name || 'filtered.png', { type: 'image/png' });
            setCarrierImage(filteredFile);
          }
        }, 'image/png');
      }
    };
  };

  const handleGenerateRandomImage = async () => {
    setIsGenerating(true);
    if (carrierPreview) URL.revokeObjectURL(carrierPreview);
    setCarrierImage(null);
    setCarrierPreview(null);
    setActiveFilter('original');
    try {
      const randomSeed = Math.floor(Math.random() * 1000);
      const imageUrl = `https://picsum.photos/seed/${randomSeed}/800/600`;
      
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `random-image-${randomSeed}.jpg`, { type: 'image/jpeg' });
      
      const previewUrl = URL.createObjectURL(file);
      setCarrierPreview(previewUrl);
      setCarrierImage(file);
      setCarrierDescription(`A random image from picsum.photos with seed ${randomSeed}`);

    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Image Generation Failed", description: "Could not fetch random image. Please try again." });
    }
    setIsGenerating(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'carrier' | 'source' | 'secret') => {
    const file = e.target.files?.[0];
    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);
      if (type === 'carrier') {
        if(carrierPreview) URL.revokeObjectURL(carrierPreview);
        setCarrierImage(file);
        setCarrierPreview(newPreviewUrl);
        setCarrierDescription(`Uploaded image: ${file.name}`);
        if(encodedImage) URL.revokeObjectURL(encodedImage);
        setEncodedImage(null);
        setCarrierSource('upload');
        setActiveFilter('original');
      } else if (type === 'source') {
        if(sourcePreview) URL.revokeObjectURL(sourcePreview);
        setSourceImage(file);
        setSourcePreview(newPreviewUrl);
        setDecodedData(null);
        setDecodeError(null);
      } else if (type === 'secret') {
        setSecretFile(file);
      }
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>, type: 'carrier' | 'source') => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
       const newPreviewUrl = URL.createObjectURL(file);
       if (type === 'carrier') {
        if(carrierPreview) URL.revokeObjectURL(carrierPreview);
        setCarrierImage(file);
        setCarrierPreview(newPreviewUrl);
        setCarrierDescription(`Dropped image: ${file.name}`);
        if(encodedImage) URL.revokeObjectURL(encodedImage);
        setEncodedImage(null);
        setCarrierSource('upload');
        setActiveFilter('original');
      } else if (type === 'source') {
        if(sourcePreview) URL.revokeObjectURL(sourcePreview);
        setSourceImage(file);
        setSourcePreview(newPreviewUrl);
        setDecodedData(null);
        setDecodeError(null);
      }
    } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please drop an image file.",
        })
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleEncode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore) {
      toast({ title: "Please sign in", description: "You must be signed in to encode images.", variant: "destructive", action: <Button onClick={signInWithGoogle}>Sign In</Button> });
      return;
    }
    if (!carrierImage || (dataType === 'text' && !secretText) || (dataType === 'file' && !secretFile) || !encodePassword) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill all required fields to generate the image.",
      })
      return;
    }

    setIsEncoding(true);
    if(encodedImage) URL.revokeObjectURL(encodedImage);
    setEncodedImage(null);

    try {
        // This is a simulation.
        // A real steganography app would embed data into the image here.
        const encodedImageFile = carrierImage;

        await saveEncodedImage(firestore, user.uid, {
            carrierImageDescription: carrierDescription,
            encryptionKey: encodePassword,
        }, encodedImageFile);

        const newEncodedImageUrl = URL.createObjectURL(encodedImageFile);
        setEncodedImage(newEncodedImageUrl);

        toast({
            title: "Image Processed & Saved",
            description: "Your data has been secretly embedded and saved to your profile.",
        });

    } catch(error) {
        console.error(error);
         toast({
            variant: "destructive",
            title: "Encoding Failed",
            description: "Could not save the encoded image. Check permissions and try again.",
        });
    } finally {
      setIsEncoding(false);
    }
  };
  
  const handleDecode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceImage || !decodePassword) {
       toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide an image and a password to extract data.",
      })
      return;
    }
    
    setIsDecoding(true);
    setDecodedData(null);
    setDecodeError(null);
    if (decodedFileUrl) {
      URL.revokeObjectURL(decodedFileUrl);
      setDecodedFileUrl(null);
    }

    // Simulate decoding process
    setTimeout(() => {
      // This is a simulation. A real app would check if the password matches
      // the key used during the (simulated) encoding.
      if (decodePassword === encodePassword && encodePassword !== '') {
        if (dataType === 'text' && secretText) {
          setDecodedData({ type: 'text', content: secretText });
        } else if (dataType === 'file' && secretFile) {
          const url = URL.createObjectURL(secretFile);
          setDecodedData({ type: 'file', content: secretFile });
          setDecodedFileUrl(url);
        } else {
            setDecodeError('No data was originally encoded in this session, or the original data is missing.');
        }
      } else {
        setDecodeError('Decryption failed. Invalid password or no data found in the image.');
      }
      setIsDecoding(false);
    }, 2000);
  };
  
  const onClear = (type: 'carrier' | 'source') => {
    if (type === 'carrier') {
      if (carrierPreview) URL.revokeObjectURL(carrierPreview);
      setCarrierImage(null);
      setCarrierPreview(null);
      setCarrierDescription('');
      setActiveFilter('original');
    } else {
      if (sourcePreview) URL.revokeObjectURL(sourcePreview);
      setSourceImage(null);
      setSourcePreview(null);
    }
  }

  const handleGenerateKey = () => {
    const key = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    setEncodePassword(key);
  };

  const FileDropzone = ({ id, onFileChange, onDrop, onDragOver, preview, onClear, children, className }: { id?: string, onFileChange?: React.ChangeEventHandler<HTMLInputElement>, onDrop: React.DragEventHandler<HTMLLabelElement>, onDragOver: React.DragEventHandler<HTMLLabelElement>, preview: string | null, onClear: () => void, children?: React.ReactNode, className?: string }) => (
    <div className="relative">
      <Label
        htmlFor={id}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className={cn(
          `flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors`,
          preview ? 'border-primary' : 'border-border',
          className
        )}
      >
        {preview ? (
            <Image 
                src={preview} 
                alt="Image preview" 
                fill 
                className={cn(
                    "object-contain rounded-lg p-2",
                    activeFilter === 'grayscale' && 'grayscale',
                    activeFilter === 'sepia' && 'sepia'
                )} 
            />
        ) : (
          children || (
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
              <UploadCloud className="w-10 h-10 mb-4 text-primary" />
              <p className="mb-2 text-sm text-foreground/80"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, or GIF</p>
            </div>
          )
        )}
        {id && <Input id={id} type="file" accept="image/*" className="hidden" onChange={onFileChange} />}
      </Label>
      {preview && (
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/50 hover:bg-background/80 rounded-full z-10" onClick={onClear}>
            <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="hidden"></canvas>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Try ImageCloak</h2>
        <p className="max-w-2xl mx-auto mt-2 text-muted-foreground">Embed or extract data in two simple steps.</p>
      </div>
      <Tabs defaultValue="encode" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto">
          <TabsTrigger value="encode">
            <FileText className="mr-2 h-4 w-4" /> Encode
          </TabsTrigger>
          <TabsTrigger value="decode">
            <ShieldCheck className="mr-2 h-4 w-4" /> Decode
          </TabsTrigger>
        </TabsList>

        <TabsContent value="encode">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Embed Data into an Image</CardTitle>
              <CardDescription>Hide a secret message or a small file within an image. Only those with the password can retrieve it.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEncode} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>1. Carrier Image</Label>
                        <Tabs value={carrierSource} onValueChange={(value) => setCarrierSource(value as CarrierSource)} className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="upload">
                              <UploadCloud className="mr-2 h-4 w-4" /> Upload
                            </TabsTrigger>
                            <TabsTrigger value="random">
                              <Wand2 className="mr-2 h-4 w-4" /> Random
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="upload" className="mt-4">
                            <FileDropzone 
                              id="carrier-image" 
                              onFileChange={(e) => handleFileChange(e, 'carrier')} 
                              onDrop={(e) => handleDrop(e, 'carrier')}
                              onDragOver={handleDragOver}
                              preview={carrierPreview}
                              onClear={() => onClear('carrier')}
                            />
                          </TabsContent>
                          <TabsContent value="random" className="mt-4">
                            <div className="space-y-4">
                                <Button type="button" className="w-full" disabled={isGenerating} onClick={handleGenerateRandomImage}>
                                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                  Generate Random Image
                                </Button>
                                <FileDropzone 
                                  onDrop={(e) => handleDrop(e, 'carrier')}
                                  onDragOver={handleDragOver}
                                  preview={carrierPreview}
                                  onClear={() => onClear('carrier')}>
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                      <Wand2 className="w-10 h-10 mb-4 text-primary" />
                                      <p className="mb-2 text-sm text-foreground/80">Your generated image will appear here</p>
                                    </div>
                                </FileDropzone>
                            </div>
                          </TabsContent>
                        </Tabs>
                    </div>
                    {carrierPreview && (
                        <div className="space-y-2 animate-in fade-in">
                          <Label>2. Filters</Label>
                           <div className="flex items-center gap-2">
                                <Palette className="h-5 w-5 text-muted-foreground" />
                                <div className="flex gap-2">
                                    <Button type="button" variant={activeFilter === 'original' ? 'secondary' : 'ghost'} size="sm" onClick={() => handleFilterChange('original')}>Original</Button>
                                    <Button type="button" variant={activeFilter === 'grayscale' ? 'secondary' : 'ghost'} size="sm" onClick={() => handleFilterChange('grayscale')}>Grayscale</Button>
                                    <Button type="button" variant={activeFilter === 'sepia' ? 'secondary' : 'ghost'} size="sm" onClick={() => handleFilterChange('sepia')}>Sepia</Button>
                                </div>
                           </div>
                        </div>
                    )}
                  </div>


                  <div className="space-y-4 flex flex-col">
                    <div className="space-y-2">
                      <Label>3. Data to Hide</Label>
                      <RadioGroup value={dataType} onValueChange={(value: DataType) => setDataType(value)} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="text" id="r1" />
                          <Label htmlFor="r1">Text</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="file" id="r2" />
                          <Label htmlFor="r2">File</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {dataType === 'text' ? (
                      <Textarea 
                        placeholder="Enter your secret message here..." 
                        value={secretText} 
                        onChange={(e) => setSecretText(e.target.value)}
                        rows={6}
                        className="flex-grow"
                      />
                    ) : (
                      <Label htmlFor="secret-file" className="flex items-center gap-2 rounded-md border border-input p-2.5 cursor-pointer hover:bg-muted/50">
                        <FileIcon className="h-6 w-6 text-muted-foreground"/>
                        <span className="flex-grow text-sm text-muted-foreground">
                          {secretFile ? secretFile.name : 'Choose a file...'}
                        </span>
                        <Input id="secret-file" type="file" className="hidden" onChange={(e) => handleFileChange(e, 'secret')} />
                      </Label>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="encode-password">4. Password</Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="encode-password" type="text" placeholder="Your secret key" className="pl-10 pr-24" value={encodePassword} onChange={(e) => setEncodePassword(e.target.value)} />
                         <Button type="button" variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2" onClick={handleGenerateKey}>
                           <RefreshCw className="mr-2 h-4 w-4" />
                           Generate
                         </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 pt-4">
                  <Button type="submit" disabled={isEncoding || !user} className="w-full max-w-xs">
                    {isEncoding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEncoding ? 'Embedding Data...' : 'Generate & Save Image'}
                  </Button>
                   {!user && (
                        <Alert className="mt-2 max-w-xs w-full">
                          <AlertDescription className="flex items-center justify-between">
                            Please sign in to encode.
                            <Button variant="link" className="p-0 h-auto" onClick={signInWithGoogle}>Sign In</Button>
                          </AlertDescription>
                        </Alert>
                    )}

                  {encodedImage && (
                    <div className="w-full max-w-xs text-center p-4 bg-muted rounded-lg animate-in fade-in">
                      <p className="text-sm font-medium mb-2">Your image is ready!</p>
                      <Button asChild variant="secondary" className="w-full">
                        <a href={encodedImage} download={carrierImage?.name || 'encoded-image.png'}>
                          <Download className="mr-2 h-4 w-4" /> Download Image
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decode">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Extract Data from an Image</CardTitle>
              <CardDescription>Upload an image and provide the password to reveal any hidden data.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDecode} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-2">
                    <Label>1. Source Image</Label>
                    <FileDropzone 
                      id="source-image" 
                      onFileChange={(e) => handleFileChange(e, 'source')} 
                      onDrop={(e) => handleDrop(e, 'source')}
                      onDragOver={handleDragOver}
                      preview={sourcePreview}
                      onClear={() => onClear('source')}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="decode-password">2. Password</Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="decode-password" type="password" placeholder="Enter secret key to decrypt" className="pl-10" value={decodePassword} onChange={(e) => setDecodePassword(e.target.value)} />
                      </div>
                    </div>
                    <Button type="submit" disabled={isDecoding} className="w-full">
                      {isDecoding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isDecoding ? 'Extracting...' : 'Extract Data'}
                    </Button>
                  </div>
                </div>
                
                <div className="pt-4 min-h-[110px]">
                  {decodedData && (
                    <Alert variant="default" className="bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700 animate-in fade-in">
                      <ShieldCheck className="h-4 w-4 !text-green-600 dark:!text-green-400" />
                      <AlertTitle className="text-green-800 dark:text-green-300">Data Extracted Successfully</AlertTitle>
                      <AlertDescription>
                        {decodedData.type === 'text' && (
                          <p className="text-green-700 dark:text-green-400 font-mono text-sm break-words">
                            {decodedData.content}
                          </p>
                        )}
                        {decodedData.type === 'file' && decodedFileUrl && (
                          <Button asChild variant="secondary" size="sm" className="mt-2">
                            <a href={decodedFileUrl} download={decodedData.content.name}>
                              <Download className="mr-2 h-4 w-4" />
                              Download {decodedData.content.name}
                            </a>
                          </Button>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                  {decodeError && (
                    <Alert variant="destructive" className="animate-in fade-in">
                      <Unplug className="h-4 w-4" />
                      <AlertTitle>Extraction Failed</AlertTitle>
                      <AlertDescription>
                        {decodeError}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
