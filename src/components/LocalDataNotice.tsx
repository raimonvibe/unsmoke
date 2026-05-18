import { LOCAL_DATA_NOTICE } from "@/lib/health-sources";

interface LocalDataNoticeProps {
  className?: string;
}

export function LocalDataNotice({ className = "" }: LocalDataNoticeProps) {
  return (
    <p
      className={`text-xs leading-relaxed text-stone-500 sm:text-sm ${className}`.trim()}
    >
      {LOCAL_DATA_NOTICE}
    </p>
  );
}
