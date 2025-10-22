import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Papa from "papaparse";
import { Upload, X, FileText, AlertTriangle } from "lucide-react";

interface CSVUploadProps {
  onUpload: (file: File, preview: string[][]) => void;
  onCancel: () => void;
}

const CSVUpload = ({ onUpload, onCancel }: CSVUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][] | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_ROWS = 100000;

  const validateCSVContent = (data: string[][]): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Check for empty data
    if (data.length === 0) {
      errors.push("CSV file is empty");
      return { isValid: false, errors };
    }

    // Check row limit
    if (data.length > MAX_ROWS) {
      errors.push(`CSV exceeds maximum row limit of ${MAX_ROWS.toLocaleString()}`);
    }

    // Validate headers (first row)
    const headers = data[0];
    const headerPattern = /^[a-zA-Z0-9_\s]+$/;
    
    headers.forEach((header, index) => {
      if (!headerPattern.test(header)) {
        errors.push(`Invalid header at column ${index + 1}: "${header}"`);
      }
    });

    // Security checks for injection patterns
    const sqlPatterns = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)|(--|;|\/\*|\*\/|xp_|sp_)/gi;
    const scriptPatterns = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|javascript:|on\w+\s*=/gi;

    data.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellStr = String(cell);
        
        if (sqlPatterns.test(cellStr)) {
          errors.push(`Potential SQL injection detected at row ${rowIndex + 1}, column ${colIndex + 1}`);
        }
        
        if (scriptPatterns.test(cellStr)) {
          errors.push(`Potential script injection detected at row ${rowIndex + 1}, column ${colIndex + 1}`);
        }
      });
    });

    return { isValid: errors.length === 0, errors };
  };

  const sanitizeCell = (value: string): string => {
    return String(value)
      .replace(/[<>]/g, "")
      .replace(/['"`;]/g, "")
      .trim();
  };

  const processFile = useCallback((selectedFile: File) => {
    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!selectedFile.name.endsWith(".csv")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    setFile(selectedFile);

    Papa.parse(selectedFile, {
      complete: (results) => {
        const data = results.data as string[][];
        
        // Validate content
        const validation = validateCSVContent(data);
        
        if (!validation.isValid) {
          toast({
            title: "Security validation failed",
            description: validation.errors[0],
            variant: "destructive",
          });
          setIsValidating(false);
          setFile(null);
          return;
        }

        // Sanitize data
        const sanitizedData = data.map((row) => row.map(sanitizeCell));
        
        // Store preview (first 5 rows)
        setPreview(sanitizedData.slice(0, 5));
        setIsValidating(false);

        toast({
          title: "File validated",
          description: "CSV file passed security checks",
        });
      },
      error: (error) => {
        toast({
          title: "Parse error",
          description: error.message,
          variant: "destructive",
        });
        setIsValidating(false);
        setFile(null);
      },
    });
  }, [toast]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        processFile(droppedFile);
      }
    },
    [processFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file && preview) {
      onUpload(file, preview);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="glass p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Upload size={20} className="text-primary" />
            Upload CSV File
          </h3>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X size={20} />
          </Button>
        </div>

        {!file ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <FileText className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your CSV file here, or click to browse
            </p>
            <label htmlFor="file-input">
              <Button variant="outline" className="cursor-pointer" asChild>
                <span>Browse Files</span>
              </Button>
            </label>
            <input
              id="file-input"
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
            />
            <div className="mt-4 text-xs text-muted-foreground space-y-1">
              <p>• Maximum file size: 10MB</p>
              <p>• Maximum rows: 100,000</p>
              <p>• Only CSV format supported</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <FileText className="text-primary flex-shrink-0 mt-1" size={24} />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>

            {preview && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Preview (first 5 rows):</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-border rounded-lg">
                    <tbody>
                      {preview.map((row, i) => (
                        <tr key={i} className="border-b border-border last:border-b-0">
                          {row.map((cell, j) => (
                            <td key={j} className="p-2 border-r border-border last:border-r-0">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <AlertTriangle size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                File has been validated and sanitized for security
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleUpload}
                disabled={isValidating}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Upload & Analyze
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default CSVUpload;
