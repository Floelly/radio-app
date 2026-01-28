export function HomeView() {
  return (
    <div className="flex flex-col items-center pt-6 pb-8">
      <div className="w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl bg-base-300 mb-6">
        <div className="w-full h-full flex items-center justify-center text-sm text-base-content/60">
          Cover
        </div>
      </div>

      <div className="w-full max-w-sm text-center space-y-1 mb-6">
        <h2 className="text-xl font-semibold truncate">
          Titel des aktuellen Songs
        </h2>
        <p className="text-sm text-base-content/80 truncate">
          Interpret · Albumname
        </p>
        <p className="text-xs text-base-content/60">
          Zusatzinfo (z.B. „Live im Studio“)
        </p>
      </div>
    </div>
  )
}