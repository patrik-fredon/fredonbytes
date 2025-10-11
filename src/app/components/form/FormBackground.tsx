import Image from 'next/image';

/**
 * Optimized background component for the form
 * Uses Next.js Image component for better performance
 */
export default function FormBackground() {
  return (
    <>
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
      
      {/* Optimized background image with Next.js Image */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5 overflow-hidden">
        <Image
          src="/fredonbytes-logo-with-background.png"
          alt=""
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
          style={{ filter: 'blur(8px)' }}
        />
      </div>
      
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 backdrop-blur-sm" />
    </>
  );
}
