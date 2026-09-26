export function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-powder-pink via-peach to-lavender py-2 px-4 text-center text-xs sm:text-sm font-medium text-chocolate/90 tracking-wide border-b border-chocolate/5">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span>✨ Her kutlama eşsiz bir lezzeti hak eder. Bize WhatsApp&apos;tan ulaşın! ✨</span>
        <span className="inline-flex items-center gap-1 text-chocolate/70">
          <i className="fa-solid fa-location-dot text-[10px]"></i>
          Keşan, Edirne
        </span>
      </div>
    </div>
  );
}
