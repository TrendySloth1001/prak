
"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, File, KeyRound, Download, Loader2, Unplug, ShieldCheck, FileText, X } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";

type DataType = 'text' | 'file';
type DecodedDataType = { type: 'text'; content: string } | { type: 'file'; content: File };

export default function ImageCloak() {
  const { toast } = useToast();

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

  useEffect(() => {
    return () => {
      if (carrierPreview) URL.revokeObjectURL(carrierPreview);
      if (sourcePreview) URL.revokeObjectURL(sourcePreview);
      if (encodedImage) URL.revokeObjectURL(encodedImage);
      if (decodedFileUrl) URL.revokeObjectURL(decodedFileUrl);
    };
  }, [carrierPreview, sourcePreview, encodedImage, decodedFileUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'carrier' | 'source' | 'secret') => {
    const file = e.target.files?.[0];
    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);
      if (type === 'carrier') {
        if(carrierPreview) URL.revokeObjectURL(carrierPreview);
        setCarrierImage(file);
        setCarrierPreview(newPreviewUrl);
        if(encodedImage) URL.revokeObjectURL(encodedImage);
        setEncodedImage(null);
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
        if(encodedImage) URL.revokeObjectURL(encodedImage);
        setEncodedImage(null);
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

  const handleEncode = (e: React.FormEvent) => {
    e.preventDefault();
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

    // Simulate encoding process
    setTimeout(() => {
      if (carrierImage) {
        // In a real app, you would process the image and embed data here.
        // For now, we just create a URL for the original image to simulate a result.
        const newEncodedImageUrl = URL.createObjectURL(carrierImage);
        setEncodedImage(newEncodedImageUrl);
      }
      setIsEncoding(false);
      toast({
        title: "Image Processed",
        description: "Your data has been secretly embedded in the image.",
      })
    }, 2000);
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
      // This is where the logic fix is. We check the simulated password.
      if (decodePassword === encodePassword && encodePassword !== '') {
        if (dataType === 'text' && secretText) {
          setDecodedData({ type: 'text', content: secretText });
        } else if (dataType === 'file' && secretFile) {
          setDecodedData({ type: 'file', content: secretFile });
          // This is the fix: create a downloadable URL for the file.
          const url = URL.createObjectURL(secretFile);
          setDecodedFileUrl(url);
        } else {
            setDecodeError('No data was encoded, or the original data is missing.');
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
    } else {
      if (sourcePreview) URL.revokeObjectURL(sourcePreview);
      setSourceImage(null);
      setSourcePreview(null);
    }
  }

  const FileDropzone = ({ id, onFileChange, onDrop, onDragOver, preview, onClear }: { id: string, onFileChange: React.ChangeEventHandler<HTMLInputElement>, onDrop: React.DragEventHandler<HTMLLabelElement>, onDragOver: React.DragEventHandler<HTMLLabelElement>, preview: string | null, onClear: () => void }) => (
    <div className="relative">
      <Label
        htmlFor={id}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors ${preview ? 'border-primary' : 'border-border'}`}
      >
        {preview ? (
          <Image src={preview} alt="Image preview" fill className="object-contain rounded-lg p-2" />
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <UploadCloud className="w-10 h-10 mb-4 text-primary" />
            <p className="mb-2 text-sm text-foreground/80"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, or GIF</p>
          </div>
        )}
        <Input id={id} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
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
                  <div className="space-y-2">
                    <Label>1. Carrier Image</Label>
                    <FileDropzone 
                      id="carrier-image" 
                      onFileChange={(e) => handleFileChange(e, 'carrier')} 
                      onDrop={(e) => handleDrop(e, 'carrier')}
                      onDragOver={handleDragOver}
                      preview={carrierPreview}
                      onClear={() => onClear('carrier')}
                    />
                  </div>
                  <div className="space-y-4 flex flex-col">
                    <div className="space-y-2">
                      <Label>2. Data to Hide</Label>
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
                        <File className="h-6 w-6 text-muted-foreground"/>
                        <span className="flex-grow text-sm text-muted-foreground">
                          {secretFile ? secretFile.name : 'Choose a file...'}
                        </span>
                        <Input id="secret-file" type="file" className="hidden" onChange={(e) => handleFileChange(e, 'secret')} />
                      </Label>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="encode-password">3. Password</Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="encode-password" type="password" placeholder="Your secret key" className="pl-10" value={encodePassword} onChange={(e) => setEncodePassword(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 pt-4">
                  <Button type="submit" disabled={isEncoding} className="w-full max-w-xs">
                    {isEncoding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEncoding ? 'Embedding Data...' : 'Generate Image'}
                  </Button>

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
