

"use client";

import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, File as FileIcon, KeyRound, Download, Loader2, Unplug, ShieldCheck, FileText, X, Wand2, RefreshCw, Palette, Type, Upload, Settings, ChevronDown, CheckCircle2, FileType, Image as ImageIcon, Eye, EyeOff, AlertCircle, Sparkles, Bot } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from '@/firebase';
import { signInWithGoogle } from '@/firebase/auth/auth-helpers';
import { saveEncodedImage } from '@/firebase/auth/user';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { analyzeImage, AnalyzeImageOutput } from '@/ai/flows/analyze-image-flow';

type DataType = 'text' | 'file';
type DecodedDataType = { type: 'text'; content: string } | { type: 'file'; content: File, textContent: string | null };
type CarrierSource = 'upload' | 'random';
type FilterType = 'original' | 'grayscale' | 'sepia';
type AlgorithmType = 'AES-256' | 'Serpent' | 'Twofish';
type EncodingLog = { message: string; status: 'pending' | 'complete' | 'error' };


const FileDropzone = ({ id, onFileChange, onDrop, onDragOver, preview, onClear, children, className, activeFilter }: { id?: string, onFileChange?: React.ChangeEventHandler<HTMLInputElement>, onDrop: React.DragEventHandler<HTMLLabelElement>, onDragOver: React.DragEventHandler<HTMLLabelElement>, preview: string | null, onClear: () => void, children?: React.ReactNode, className?: string, activeFilter?: FilterType }) => (
    <div className="relative">
      <Label
        htmlFor={id}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className={cn(
          `flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors`,
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
              <UploadCloud className="w-10 h-10 text-primary" />
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
  
const Step = ({ step, title, children }: { step: number; title: string; children: React.ReactNode }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-4">
            <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-accent text-accent-foreground font-bold">{step}</div>
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        </div>
        <div className="pl-12">
            {children}
        </div>
    </div>
);

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
  const [decodedFileUrl, setDecodedFileUrl] = useState<string | null>(null);

  const [carrierSource, setCarrierSource] = useState<CarrierSource>('upload');
  const [isGenerating, setIsGenerating] = useState(false);
  const [carrierDescription, setCarrierDescription] = useState('');
  const [randomImageUrl, setRandomImageUrl] = useState<string>('');
  
  const [activeFilter, setActiveFilter] = useState<FilterType>('original');
  const [watermark, setWatermark] = useState('');
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('AES-256');

  const [encodingLogs, setEncodingLogs] = useState<EncodingLog[]>([]);
  const [decodingLogs, setDecodingLogs] = useState<EncodingLog[]>([]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeImageOutput | null>(null);


  const canvasRef = useRef<HTMLCanvasElement>(null);


  useEffect(() => {
    return () => {
      if (carrierPreview) URL.revokeObjectURL(carrierPreview);
      if (sourcePreview) URL.revokeObjectURL(sourcePreview);
      if (encodedImage) URL.revokeObjectURL(encodedImage);
      if (decodedFileUrl) URL.revokeObjectURL(decodedFileUrl);
    };
  }, [carrierPreview, sourcePreview, encodedImage, decodedFileUrl]);
  
  const applyCanvasEffects = (image: HTMLImageElement, filter: FilterType, watermarkText: string) => {
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

    // Apply watermark
    if (watermarkText) {
        ctx.filter = 'none'; // Reset filter to draw text correctly
        ctx.font = `${Math.max(24, canvas.width / 30)}px Inter, sans-serif`;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText(watermarkText, canvas.width - 20, canvas.height - 20);
    }
  };

  const updateCanvasAndFile = (filter: FilterType, watermarkText: string) => {
    if (!carrierPreview || !carrierImage) return;

    const img = document.createElement('img');
    img.crossOrigin = 'anonymous';
    img.src = carrierPreview;
    img.onload = () => {
      applyCanvasEffects(img, filter, watermarkText);
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            // Use a consistent name to avoid creating new File objects unnecessarily if only text changes
            const newFileName = carrierImage.name.split('?_v=')[0]; 
            const finalFile = new File([blob], `${newFileName}?_v=${Date.now()}`, { type: 'image/png' });
            setCarrierImage(finalFile);
          }
        }, 'image/png');
      }
    };
  };
  
  useEffect(() => {
    updateCanvasAndFile(activeFilter, watermark);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, watermark, carrierPreview]);
  
  const handleGenerateRandomImage = async () => {
    setIsGenerating(true);
    if (carrierPreview) URL.revokeObjectURL(carrierPreview);
    setCarrierImage(null);
    setCarrierPreview(null);
    setRandomImageUrl('');
    setActiveFilter('original');
    setAnalysisResult(null);

    try {
      const randomSeed = Math.floor(Math.random() * 1000);
      const imageUrl = `https://picsum.photos/seed/${randomSeed}/800/600`;
      
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `random-image-${randomSeed}.jpg`, { type: 'image/jpeg' });
      
      const previewUrl = URL.createObjectURL(file);
      setCarrierPreview(previewUrl);
      setCarrierImage(file);
      setRandomImageUrl(imageUrl); // Store the original public URL
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
      if (type === 'carrier') {
        const newPreviewUrl = URL.createObjectURL(file);
        if(carrierPreview) URL.revokeObjectURL(carrierPreview);
        setCarrierImage(file);
        setCarrierPreview(newPreviewUrl);
        setCarrierDescription(`Uploaded image: ${file.name}`);
        if(encodedImage) URL.revokeObjectURL(encodedImage);
        setEncodedImage(null);
        setCarrierSource('upload');
        setRandomImageUrl(''); // Clear random image URL
        setActiveFilter('original');
        setWatermark('');
        setAnalysisResult(null);
      } else if (type === 'source') {
        const newPreviewUrl = URL.createObjectURL(file);
        if(sourcePreview) URL.revokeObjectURL(sourcePreview);
        setSourceImage(file);
        setSourcePreview(newPreviewUrl);
        setDecodedData(null);
        setDecodingLogs([]);
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
       if (type === 'carrier') {
        const newPreviewUrl = URL.createObjectURL(file);
        if(carrierPreview) URL.revokeObjectURL(carrierPreview);
        setCarrierImage(file);
        setCarrierPreview(newPreviewUrl);
        setCarrierDescription(`Dropped image: ${file.name}`);
        if(encodedImage) URL.revokeObjectURL(encodedImage);
        setEncodedImage(null);
        setCarrierSource('upload');
        setRandomImageUrl(''); // Clear random image URL
        setActiveFilter('original');
        setWatermark('');
        setAnalysisResult(null);
      } else if (type === 'source') {
        const newPreviewUrl = URL.createObjectURL(file);
        if(sourcePreview) URL.revokeObjectURL(sourcePreview);
        setSourceImage(file);
        setSourcePreview(newPreviewUrl);
        setDecodedData(null);
        setDecodingLogs([]);
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
        description: "Please fill all required fields.",
      })
      return;
    }

    setIsEncoding(true);
    setEncodingLogs([]);
    if(encodedImage) URL.revokeObjectURL(encodedImage);
    setEncodedImage(null);
    
    const addLog: (message: string, status?: EncodingLog['status']) => void = (message, status = 'pending') => {
        setEncodingLogs(prev => {
            const newLogs = [...prev];
            const lastLog = newLogs[newLogs.length - 1];
            
            if (message === 'Metadata saved successfully.') {
                // Mark all previous as complete
                newLogs.forEach(log => log.status = 'complete');
            } else if (lastLog && lastLog.status === 'pending') {
                lastLog.status = 'complete';
            }
            
            newLogs.push({ message, status });

            return newLogs;
        });
    };

    try {
        await saveEncodedImage(firestore, user.uid, {
            carrierImageDescription: carrierDescription,
            carrierImageUrl: carrierSource === 'upload' ? '' : randomImageUrl, 
            encryptionKey: encodePassword,
            algorithm: algorithm,
            watermark: watermark,
        }, addLog);

        // Since we don't upload, the encoded image is just the one in the canvas/preview
        const canvas = canvasRef.current;
        if(canvas) {
            const newEncodedImageUrl = canvas.toDataURL('image/png');
            setEncodedImage(newEncodedImageUrl);
        } else if (carrierPreview) {
             setEncodedImage(carrierPreview);
        }

        toast({
            title: "Metadata Saved",
            description: "Your image's metadata has been saved to your profile.",
        });

    } catch(error: any) {
       addLog(error.message, 'error');
        toast({
          variant: "destructive",
          title: "Saving Failed",
          description: "An unexpected error occurred. See logs for details.",
        });
    } finally {
      setIsEncoding(false);
    }
  };
  
    const handleDecode = async (e: React.FormEvent) => {
        e.preventDefault();
        setDecodedData(null);
        setDecodingLogs([]);
        if (decodedFileUrl) {
            URL.revokeObjectURL(decodedFileUrl);
            setDecodedFileUrl(null);
        }

        if (!sourceImage || !decodePassword) {
          toast({
              variant: "destructive",
              title: "Missing Information",
              description: "Please provide an image and a password to extract data.",
          })
          return;
        }
        
        setIsDecoding(true);
        
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

        const addLog: (message: string, status?: EncodingLog['status']) => void = (message, status = 'pending') => {
            setDecodingLogs(prev => {
                const newLogs = [...prev];
                const lastLog = newLogs[newLogs.length - 1];

                if ((status === 'complete' || status === 'error') && newLogs.length > 0) {
                     newLogs.forEach(log => {
                        if (log.status === 'pending') log.status = 'complete';
                    });
                } else if (lastLog && lastLog.status === 'pending') {
                    lastLog.status = 'complete';
                }
                
                newLogs.push({ message, status });
                return newLogs;
            });
        };

        try {
            addLog('Initiating decoding process...');
            await delay(500);

            addLog('Analyzing image pixels...');
            await delay(700);

            addLog('Locating hidden data signature...');
            await delay(800);

            // This is a simulation. A real app would check if the password matches
            // the key used during the (simulated) encoding.
            if (decodePassword === encodePassword && encodePassword !== '') {
                addLog('Password accepted. Decrypting data...', 'pending');
                await delay(1000);

                if (dataType === 'text' && secretText) {
                    setDecodedData({ type: 'text', content: secretText, textContent: null });
                } else if (dataType === 'file' && secretFile) {
                    const url = URL.createObjectURL(secretFile);
                    setDecodedFileUrl(url);

                    if (secretFile.type.startsWith('text/')) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                        setDecodedData({ type: 'file', content: secretFile, textContent: event.target?.result as string });
                        };
                        reader.readAsText(secretFile);
                    } else {
                        setDecodedData({ type: 'file', content: secretFile, textContent: null });
                    }
                } else {
                    throw new Error('No data was originally encoded in this session, or the original data is missing.');
                }
                addLog('Decryption complete. Data extracted successfully.', 'complete');
            } else {
                throw new Error('Decryption failed. Invalid password or no data found in the image.');
            }
        } catch (error: any) {
            addLog(error.message, 'error');
        } finally {
            setIsDecoding(false);
        }
    };
  
  const onClear = (type: 'carrier' | 'source' | 'secret') => {
    if (type === 'carrier') {
      if (carrierPreview) URL.revokeObjectURL(carrierPreview);
      setCarrierImage(null);
      setCarrierPreview(null);
      setCarrierDescription('');
      setRandomImageUrl('');
      setActiveFilter('original');
      setWatermark('');
      setAnalysisResult(null);
    } else if (type === 'source') {
      if (sourcePreview) URL.revokeObjectURL(sourcePreview);
      setSourceImage(null);
      setSourcePreview(null);
      setDecodedData(null);
      setDecodingLogs([]);
    } else if (type === 'secret') {
        setSecretFile(null);
    }
  }

  const handleGenerateKey = () => {
    const key = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    setEncodePassword(key);
  };

    const handleAnalyzeImage = async () => {
    if (!carrierImage) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
        const reader = new FileReader();
        reader.readAsDataURL(carrierImage);
        reader.onload = async () => {
            const imageDataUri = reader.result as string;
            const result = await analyzeImage({ image: imageDataUri });
            setAnalysisResult(result);
            toast({
                title: "Analysis Complete",
                description: "The AI has provided feedback on your image.",
            })
        };
    } catch (error) {
        console.error("Analysis failed:", error);
        toast({
            variant: "destructive",
            title: "Analysis Failed",
            description: "Could not analyze the image. Please try again.",
        })
    } finally {
        setIsAnalyzing(false);
    }
};

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  const LogViewer = ({logs}: {logs: EncodingLog[]}) => (
    <div className="w-full max-w-2xl font-code bg-gray-900 text-gray-300 rounded-lg animate-in fade-in space-y-2 mt-4 text-sm border border-gray-700 shadow-lg">
        <div className="p-3 bg-gray-800 rounded-t-lg flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
          <p className="font-semibold text-center flex-1 text-gray-400">Processing Logs</p>
        </div>
        <div className="space-y-2 p-4 max-h-48 overflow-y-auto">
        {logs.map((log, index) => (
            <div key={index} className="flex items-start gap-3">
                <div className="mt-0.5">
                    {log.status === 'pending' && <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />}
                    {log.status === 'complete' && <CheckCircle2 className="h-4 w-4 text-green-400" />}
                    {log.status === 'error' && <X className="h-4 w-4 text-red-500" />}
                </div>
                <span className={cn('flex-1', 
                  log.status === 'error' ? 'text-red-400' :
                  log.status === 'complete' ? 'text-gray-400' : 'text-gray-200'
                )}>{log.message}</span>
            </div>
        ))}
        </div>
    </div>
  );

  const getFilePreview = (file: File, fileUrl: string, textContent: string | null) => {
    const fileType = file.type;
    
    if (fileType.startsWith('image/')) {
      return <Image src={fileUrl} alt="Decoded image preview" width={400} height={300} className="rounded-md object-contain mx-auto max-h-80" />;
    }
    
    if (fileType === 'application/pdf') {
        return <object data={fileUrl} type="application/pdf" width="100%" height="500px"><p>Your browser does not support PDF previews. Please download the file to view it.</p></object>;
    }
    
    if (textContent) {
      return <Textarea value={textContent} readOnly className="font-mono bg-background/50 h-64" />;
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-muted rounded-lg">
            <FileType className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-semibold">{file.name}</p>
            <p className="text-sm text-muted-foreground">No preview available for this file type.</p>
        </div>
    );
  };
  
    const isFileViewable = (file: File | undefined): boolean => {
      if (!file) return false;
      const viewableTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'text/plain'];
      return viewableTypes.includes(file.type);
    };

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="hidden"></canvas>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Try ImageCloak</h2>
        <p className="max-w-2xl mx-auto mt-2 text-muted-foreground">Embed or extract data in simple steps.</p>
      </div>
      <Tabs defaultValue="encode" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto bg-secondary">
          <TabsTrigger value="encode">
            <FileText className="mr-2 h-4 w-4" /> Encode
          </TabsTrigger>
          <TabsTrigger value="decode">
            <ShieldCheck className="mr-2 h-4 w-4" /> Decode
          </TabsTrigger>
        </TabsList>

        <TabsContent value="encode">
          <Card className="max-w-6xl mx-auto bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Embed Data into an Image</CardTitle>
              <CardDescription>Hide a secret message or a small file within an image. Only those with the password can retrieve it.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEncode}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  
                  {/* Left Column */}
                  <div className="space-y-6">
                     <Step step={1} title="Choose Carrier Image">
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
                              activeFilter={activeFilter}
                            />
                          </TabsContent>
                           <TabsContent value="random" className="mt-4 space-y-4">
                                <Button type="button" className="w-full" disabled={isGenerating} onClick={handleGenerateRandomImage}>
                                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                                  Generate New Image
                                </Button>
                                <FileDropzone 
                                  onDrop={(e) => handleDrop(e, 'carrier')}
                                  onDragOver={handleDragOver}
                                  preview={carrierPreview}
                                  onClear={() => onClear('carrier')}
                                  activeFilter={activeFilter}>
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4 h-full">
                                      <Wand2 className="w-10 h-10 mb-4 text-primary" />
                                      <p className="mb-2 text-sm text-foreground/80">Your generated image will appear here</p>
                                    </div>
                                </FileDropzone>
                          </TabsContent>
                        </Tabs>
                    </Step>
                    
                    {carrierPreview && (
                        <div className="space-y-4 animate-in fade-in">
                          <Separator />
                           <Step step={2} title="Analyze & Add Effects">
                               <div className="space-y-4">
                                  <Button type="button" variant="outline" className="w-full" onClick={handleAnalyzeImage} disabled={isAnalyzing}>
                                      {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                                      Analyze Image Suitability
                                  </Button>
                                    {analysisResult && (
                                        <Alert>
                                            <Sparkles className="h-4 w-4" />
                                            <AlertTitle>{analysisResult.suitability}</AlertTitle>
                                            <AlertDescription>
                                                {analysisResult.reason}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                  <div className="flex items-center gap-2">
                                      <Palette className="h-5 w-5 text-muted-foreground" />
                                      <Label className="font-normal">Filter:</Label>
                                      <div className="flex gap-2">
                                          <Button type="button" variant={activeFilter === 'original' ? 'secondary' : 'ghost'} size="sm" onClick={() => setActiveFilter('original')}>Original</Button>
                                          <Button type="button" variant={activeFilter === 'grayscale' ? 'secondary' : 'ghost'} size="sm" onClick={() => setActiveFilter('grayscale')}>Grayscale</Button>
                                          <Button type="button" variant={activeFilter === 'sepia' ? 'secondary' : 'ghost'} size="sm" onClick={() => setActiveFilter('sepia')}>Sepia</Button>
                                      </div>
                                  </div>
                               </div>
                           </Step>
                        </div>
                    )}
                  </div>


                  {/* Right Column */}
                  <div className="space-y-6">
                    <Step step={3} title="Provide Secret Data">
                       <Tabs value={dataType} onValueChange={(value) => setDataType(value as DataType)} className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="text">
                                <Type className="mr-2 h-4 w-4" /> Text Message
                            </TabsTrigger>
                            <TabsTrigger value="file">
                               <FileIcon className="mr-2 h-4 w-4" /> Any File
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="text" className="mt-4">
                            <Textarea 
                              placeholder="Enter your secret message here. The longer the message, the more it will affect the look of the final image (in a real app)." 
                              value={secretText} 
                              onChange={(e) => setSecretText(e.target.value)}
                              rows={8}
                              className="text-base"
                            />
                          </TabsContent>
                          <TabsContent value="file" className="mt-4">
                            {!secretFile ? (
                                <Label htmlFor="secret-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-foreground/80"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-muted-foreground">Any file type</p>
                                    </div>
                                    <Input id="secret-file" type="file" className="hidden" onChange={(e) => handleFileChange(e, 'secret')} />
                                </Label>
                            ) : (
                                <div className="flex items-center justify-between w-full h-40 border rounded-lg p-6 bg-muted/50">
                                    <div className='space-y-1'>
                                        <p className='font-medium text-lg leading-tight'>File Ready</p>
                                        <p className='text-sm text-muted-foreground truncate max-w-xs' title={secretFile.name}>{secretFile.name}</p>
                                        <p className='text-xs text-muted-foreground'>{formatFileSize(secretFile.size)}</p>
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => onClear('secret')}>
                                        <X className="h-5 w-5 text-destructive" />
                                    </Button>
                                </div>
                            )}
                          </TabsContent>
                       </Tabs>
                    </Step>

                    <Separator />

                    <Step step={4} title="Set a Password">
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="encode-password" type="text" placeholder="Your secret key" className="pl-10" value={encodePassword} onChange={(e) => setEncodePassword(e.target.value)} />
                         <Button type="button" variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-8" onClick={handleGenerateKey}>
                           <RefreshCw className="mr-2 h-4 w-4" />
                           Generate
                         </Button>
                      </div>
                    </Step>
                  </div>
                </div>
                
                <Separator className="my-8" />
                
                <div className="flex flex-col items-center gap-6">
                    <Collapsible className="w-full max-w-2xl">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full text-muted-foreground">
                            <Settings className="h-4 w-4 mr-2" />
                            Advanced Options
                            <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-6 pt-6 animate-in fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="space-y-2">
                                <Label htmlFor="watermark">Custom Watermark</Label>
                                <Input id="watermark" placeholder="e.g., © My Name" value={watermark} onChange={(e) => setWatermark(e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="algorithm">Encryption Algorithm</Label>
                                <Select value={algorithm} onValueChange={(value: AlgorithmType) => setAlgorithm(value)}>
                                    <SelectTrigger id="algorithm">
                                        <SelectValue placeholder="Select algorithm" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AES-256">AES-256 (Secure)</SelectItem>
                                        <SelectItem value="Serpent">Serpent (Robust)</SelectItem>
                                        <SelectItem value="Twofish">Twofish (Fast)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                    
                    <div className="flex flex-col items-center gap-4 w-full">
                        <h3 className="text-lg font-semibold tracking-tight">Ready to Go!</h3>
                         <Alert className="max-w-sm w-full">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Security Feature</AlertTitle>
                            <AlertDescription>
                                For security, extracted data is designed to be revealed only once per session.
                            </AlertDescription>
                        </Alert>
                        <Button type="submit" disabled={isEncoding || !user} size="lg" className="w-full max-w-sm bg-accent text-accent-foreground hover:bg-accent/90">
                            <ShieldCheck className="mr-2 h-5 w-5" />
                            {isEncoding ? 'Embedding Data...' : 'Save Metadata'}
                        </Button>

                      {!user && (
                            <Alert variant="destructive" className="mt-2 max-w-sm w-full">
                              <AlertDescription className="flex items-center justify-center">
                                Please sign in to continue.
                                <Button variant="link" className="p-0 h-auto ml-2 text-destructive-foreground" onClick={signInWithGoogle}>Sign In</Button>
                              </AlertDescription>
                            </Alert>
                        )}
                      
                       {(isEncoding || encodingLogs.length > 0) && (
                            <LogViewer logs={encodingLogs} />
                        )}

                      {encodedImage && !isEncoding && (
                        <div className="w-full max-w-sm text-center p-4 bg-muted/50 rounded-lg animate-in fade-in space-y-3">
                          <p className="font-medium text-green-600">Metadata saved! You can download the image now.</p>
                          <Button asChild variant="secondary" className="w-full">
                            <a href={encodedImage} download={carrierImage?.name.replace(/\?_v=.*$/, '') || 'encoded-image.png'}>
                              <Download className="mr-2 h-4 w-4" /> Download Image
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decode">
          <Card className="max-w-4xl mx-auto bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Extract Data from an Image</CardTitle>
              <CardDescription>Upload an image and provide the password to reveal any hidden data.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDecode} className="space-y-6">
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>One-Time Extraction</AlertTitle>
                    <AlertDescription>
                        As a security feature, data can only be extracted from an image once per session. To extract again, please re-upload the image.
                    </AlertDescription>
                </Alert>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-4">
                    <Label className='pl-1'>1. Source Image</Label>
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
                    <Button type="submit" disabled={isDecoding} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      {isDecoding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isDecoding ? 'Extracting...' : 'Extract Data'}
                    </Button>
                  </div>
                </div>
                
                 {(isDecoding || decodingLogs.length > 0) && (
                    <div className="pt-4">
                        <LogViewer logs={decodingLogs} />
                    </div>
                 )}

                <div className="pt-4 min-h-[110px]">
                   {decodedData && !isDecoding && (
                    <Alert variant="default" className="bg-green-900/10 border-green-700/20 animate-in fade-in">
                      <ShieldCheck className="h-4 w-4 !text-green-600 dark:!text-green-400" />
                      <AlertTitle className="text-green-800 dark:text-green-300">Data Extracted Successfully</AlertTitle>
                      <AlertDescription>
                        <div className="space-y-4 mt-2">
                          {decodedData.type === 'text' && (
                            <Textarea
                              value={decodedData.content}
                              readOnly={false}
                              onChange={(e) => setDecodedData({...decodedData, content: e.target.value})}
                              className="mt-2 font-mono bg-background/50"
                              rows={5}
                            />
                          )}
                          {decodedData.type === 'file' && decodedFileUrl && (
                            <div className="space-y-4">
                              <div className="p-4 border rounded-lg bg-background/50">
                                {getFilePreview(decodedData.content, decodedFileUrl, decodedData.textContent)}
                              </div>
                              <div className="flex gap-2 flex-wrap">
                                <Button asChild variant="secondary" size="sm">
                                  <a href={decodedFileUrl} download={decodedData.content.name}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download {decodedData.content.name}
                                  </a>
                                </Button>
                                {isFileViewable(decodedData.content) && (
                                   <Button asChild variant="outline" size="sm">
                                     <a href={decodedFileUrl} target="_blank" rel="noopener noreferrer">
                                       <Eye className="mr-2 h-4 w-4" />
                                       View File
                                     </a>
                                   </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  {decodingLogs.some(log => log.status === 'error') && !isDecoding && (
                    <Alert variant="destructive" className="animate-in fade-in">
                      <Unplug className="h-4 w-4" />
                      <AlertTitle>Extraction Failed</AlertTitle>
                      <AlertDescription>
                        {decodingLogs.find(log => log.status === 'error')?.message}
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

    
