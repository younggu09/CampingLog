import { LucideIcon } from "lucide-react";

interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  links?: { text: string; url: string }[]; // 다중 링크 지원
  isLink?: boolean;
}

export default function InfoRow({
  icon: Icon,
  label,
  value,
  links,
  isLink = false,
}: InfoRowProps) {
  if (!value && !links) return null;

  const getValidUrl = (url: string) => {
    if (!url || url === "undefined" || url === "null") return null;
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <div className="grid grid-cols-4 gap-4 text-sm border-b border-gray-300 pb-3 mt-2 first:mt-0 min-h-[2.5rem] items-center">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-400" />
        <div className="font-medium">{label}</div>
      </div>
      <div className="col-span-3 text-gray-700">
        {links ? (
          <div className="flex gap-4">
            {links.map((link, index) => {
              const validUrl = getValidUrl(link.url);
              return validUrl ? (
                <a
                  key={index}
                  href={validUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                >
                  {link.text}
                </a>
              ) : null;
            })}
          </div>
        ) : isLink && value ? (
          <a
            href={getValidUrl(value) ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </div>
    </div>
  );
}
