export default function Header() {
    return (
        <header className="border-b border-line px-6 py-5 flex items-center justify-between">
            <div>
                <h1 className="font-display text-xl font-bold text-ink tracking-tight">
                    Bharat Pashudhan
                </h1>
                <p className="text-xs text-muted mt-0.5">
                    Indigenous breed Identification
                </p>
            </div>
            <div className="bg-surfaceAlt border border-line rounded-full px-4 py-1.5 text-xs text-muted font-medium">
                66 breeds covered
            </div>
        </header>
    );
}