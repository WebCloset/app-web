'use client';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string;
};

export default function SafeImg({ fallback = '/placeholder.webp', ...rest }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...rest}
      onError={(e) => {
        const el = e.currentTarget as HTMLImageElement;
        if (el.src !== fallback) el.src = fallback;
      }}
    />
  );
}