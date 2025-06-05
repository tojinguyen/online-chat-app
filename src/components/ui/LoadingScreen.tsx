interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({
  message = "Loading...",
}: LoadingScreenProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4"></div>
        <h1 className="text-xl font-semibold text-slate-800">{message}</h1>
        <p className="text-slate-500 mt-2">
          Please wait while we prepare your experience
        </p>
      </div>
    </div>
  );
};
