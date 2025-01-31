export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-lg font-medium text-muted-foreground">
        Loading quiz...
      </p>
    </div>
  );
}
