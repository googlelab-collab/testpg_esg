import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="max-w-md w-full">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            {message}
          </AlertDescription>
        </Alert>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 w-full bg-esg-primary text-white px-4 py-2 rounded-lg hover:bg-esg-primary/90 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
