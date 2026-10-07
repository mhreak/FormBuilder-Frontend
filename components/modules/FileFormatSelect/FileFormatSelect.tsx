interface FileFormatSelectProps {
  fileFormats: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

export default function FileFormatSelect({
  fileFormats,
  value,
  onChange,
}: FileFormatSelectProps) {
  const selectedFormats = value ? value.split(",").filter(Boolean) : [];

  function toggleFormat(format: string) {
    const exists = selectedFormats.includes(format);

    const nextFormats = exists
      ? selectedFormats.filter((item) => item !== format)
      : [...selectedFormats, format];

    onChange(nextFormats.join(","));
  }

  return (
    <div className="rounded-xl border border-border bg-background p-2">
      <div className="flex flex-wrap gap-2">
        {fileFormats.map((format) => {
          const selected = selectedFormats.includes(format.value);

          return (
            <button
              key={format.value}
              type="button"
              onClick={() => toggleFormat(format.value)}
              className={`rounded-lg border px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                selected
                  ? "border-primary bg-primary text-white"
                  : "border-border text-muted hover:bg-surface hover:text-foreground"
              }`}
            >
              {format.label}
            </button>
          );
        })}
      </div>

      {selectedFormats.length > 0 && (
        <div className="mt-2 border-t border-border pt-2">
          <p className="text-xs text-muted">فرمت‌های انتخاب‌شده:</p>

          <p className="mt-1 text-xs text-foreground">
            {selectedFormats.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
