import { 
  AlertCircle, 
  RefreshCw, 
  WifiOff, 
  Server, 
  Shield,
  Key,
  Database,
  Clock,
  Ban,
  FileText,
  UserX,
  AlertTriangle,
  HelpCircle
} from "lucide-react";
import { useState, useEffect } from "react";

interface InsightsErrorStateProps {
  error?: string | Error | any;
  onRetry?: () => void;
  isLoading?: boolean;
  showTroubleshooting?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

export default function InsightsErrorState({ 
  error = "Failed to load insights", 
  onRetry,
  isLoading = false,
  title,
  description,
  className = ""
}: InsightsErrorStateProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorCode, setErrorCode] = useState<string | null>(null);

  useEffect(() => {
    // Extract error message and code from various error formats
    if (typeof error === 'string') {
      setErrorMessage(error);
      // Try to extract HTTP error code from string
      const codeMatch = error.match(/\b(4\d{2}|5\d{2})\b/);
      setErrorCode(codeMatch ? codeMatch[0] : null);
    } else if (error instanceof Error) {
      setErrorMessage(error.message);
      // Check for axios/fetch error structure
      if ('code' in error) {
        setErrorCode(error.code as string);
      } else if ('status' in error) {
        setErrorCode(String(error.status));
      }
    } else if (error && typeof error === 'object') {
      // Handle API error responses
      if (error.message) {
        setErrorMessage(error.message);
      } else if (error.error) {
        setErrorMessage(error.error);
      } else if (error.statusText) {
        setErrorMessage(error.statusText);
      } else {
        setErrorMessage(JSON.stringify(error));
      }
      
      if (error.status) {
        setErrorCode(String(error.status));
      } else if (error.code) {
        setErrorCode(error.code);
      }
    }
  }, [error]);

  const handleRetry = async () => {
    if (!onRetry || isRetrying || isLoading) return;
    
    setIsRetrying(true);
    try {
      await onRetry();
    } catch (err) {
      console.error('Retry failed:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  const getErrorDetails = () => {
    const errorLower = errorMessage.toLowerCase();
    
    // Handle HTTP status codes first
    if (errorCode) {
      switch (errorCode) {
        case '400':
          return {
            icon: <AlertTriangle className="w-12 h-12" />,
            title: title || "Bad Request",
            description: description || "The request was invalid or cannot be served.",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-200",
            solution: "Please check your request parameters and try again."
          };
        
        case '401':
        case '403':
          return {
            icon: <Key className="w-12 h-12" />,
            title: title || "Access Denied",
            description: description || "You don't have permission to access this resource.",
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
            solution: "Please check your credentials or contact your administrator."
          };
        
        case '404':
          return {
            icon: <FileText className="w-12 h-12" />,
            title: title || "Resource Not Found",
            description: description || "The requested resource could not be found.",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            solution: "The page or resource you're looking for doesn't exist."
          };
        
        case '429':
          return {
            icon: <Clock className="w-12 h-12" />,
            title: title || "Too Many Requests",
            description: description || "You've made too many requests. Please wait a moment.",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200",
            solution: "Please wait a few minutes before trying again."
          };
        
        case '500':
          return {
            icon: <Server className="w-12 h-12" />,
            title: title || "Internal Server Error",
            description: description || "Our servers encountered an unexpected error.",
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
            solution: "Please try again in a few moments. If the problem persists, contact support."
          };
        
        case '502':
        case '503':
        case '504':
          return {
            icon: <Database className="w-12 h-12" />,
            title: title || "Service Unavailable",
            description: description || "The service is temporarily unavailable.",
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200",
            solution: "The service is undergoing maintenance or experiencing high traffic. Please try again later."
          };
      }
    }
    
    // Handle error message patterns
    if (errorLower.includes('network') || 
        errorLower.includes('connection') || 
        errorLower.includes('offline') ||
        errorLower.includes('failed to fetch')) {
      return {
        icon: <WifiOff className="w-12 h-12" />,
        title: title || "Connection Issue",
        description: description || "Unable to connect to the server. Please check your internet connection.",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        solution: "Check your internet connection and try again."
      };
    }
    
    if (errorLower.includes('timeout') || errorLower.includes('timed out')) {
      return {
        icon: <Clock className="w-12 h-12" />,
        title: title || "Request Timeout",
        description: description || "The request took too long to complete.",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        solution: "Please try again. If the problem persists, check your network connection."
      };
    }
    
    if (errorLower.includes('cors') || errorLower.includes('cross-origin')) {
      return {
        icon: <Shield className="w-12 h-12" />,
        title: title || "CORS Error",
        description: description || "Cross-origin request blocked by browser security.",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        solution: "This is usually a server configuration issue. Contact your administrator."
      };
    }
    
    if (errorLower.includes('syntax') || errorLower.includes('json')) {
      return {
        icon: <FileText className="w-12 h-12" />,
        title: title || "Data Format Error",
        description: description || "Received data is not in the expected format.",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        solution: "This might be a temporary issue. Please try refreshing."
      };
    }
    
    if (errorLower.includes('quota') || errorLower.includes('limit')) {
      return {
        icon: <Ban className="w-12 h-12" />,
        title: title || "Resource Limit Reached",
        description: description || "You've reached the limit for this resource.",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        solution: "Please wait or upgrade your plan for higher limits."
      };
    }
    
    if (errorLower.includes('unauthorized') || errorLower.includes('permission')) {
      return {
        icon: <UserX className="w-12 h-12" />,
        title: title || "Authorization Failed",
        description: description || "You don't have permission to access this data.",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        solution: "Please check your credentials or contact your administrator."
      };
    }
    
    // Default error
    return {
      icon: <AlertCircle className="w-12 h-12" />,
      title: title || "Something Went Wrong",
      description: description || errorMessage || "We couldn't load the requested data.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      solution: "This might be a temporary issue. Please try again."
    };
  };

  const errorDetails = getErrorDetails();
  const canRetry = onRetry && !isLoading && !isRetrying;

  return (
    <div className={`${errorDetails.bgColor} ${errorDetails.borderColor} border rounded-xl p-6 md:p-8 shadow-sm ${className}`}>
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        {/* Error Icon */}
        <div className={`p-4 rounded-full ${errorDetails.bgColor} ${errorDetails.borderColor} border-2 mb-5`}>
          <div className={errorDetails.color}>
            {errorDetails.icon}
          </div>
        </div>
        
        {/* Error Title */}
        <h3 className={`text-xl font-bold ${errorDetails.color} mb-3`}>
          {errorDetails.title}
        </h3>
        
        {/* Error Description */}
        <p className="text-gray-700 mb-4">
          {errorDetails.description}
        </p>
        
        {/* Error Code Display */}
        {errorCode && (
          <div className="mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Error Code:</span>
              <code className="text-sm font-bold text-gray-800">{errorCode}</code>
            </div>
          </div>
        )}
        
        {/* Suggested Solution */}
        {errorDetails.solution && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 w-full">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 mb-1">Suggested Solution</p>
                <p className="text-sm text-gray-600">{errorDetails.solution}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mb-6">
          {canRetry && (
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className={`
                flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium
                transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                bg-linear-to-r from-blue-600 to-blue-700 text-white 
                hover:from-blue-700 hover:to-blue-800 
                shadow-sm hover:shadow-md
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </button>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className={`
              flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium
              transition-all duration-200 border border-gray-300
              bg-white text-gray-700 hover:bg-gray-50
              ${!canRetry ? 'flex-1' : ''}
            `}
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>
        </div>
        
       
        
        
        
       
      </div>
    </div>
  );
}