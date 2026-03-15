interface ErrorBannerProps { message: string }
export default function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded my-3 text-center">
      <span role="img" aria-label="Error" className="mr-2">❗</span>{message}
    </div>
  );
}
