import Image from 'next/image'

interface HiveFiLogoProps {
  className?: string
  size?: number
}

export default function HiveFiLogo({ className, size = 40 }: HiveFiLogoProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/images/hivefi-logo.png"
        alt="HiveFi Logo"
        width={size}
        height={size}
        className="object-contain"
      />
    </div>
  )
}
