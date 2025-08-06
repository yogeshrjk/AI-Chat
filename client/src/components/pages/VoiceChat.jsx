export const VoiceChat = () => {
  return (
    <div className="relative w-full h-full">
      <iframe
        src="https://app.sesame.com/"
        title="Sesame App"
        className="absolute inset-0 w-full h-full z-0"
        allow="camera; microphone"
      />
      <div className="absolute inset-0 dark:bg-black opacity-60 z-10 pointer-events-none" />
    </div>
  );
};
