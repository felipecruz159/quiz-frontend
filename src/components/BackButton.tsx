import Link from 'next/link';
import { IoArrowBackCircleOutline } from 'react-icons/io5';

interface BackButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export default function BackButton({ 
  href, 
  label = 'Back', 
  className = '' 
}: BackButtonProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <Link
        href={href}
        className="inline-flex items-center gap-2 px-2 py-1 rounded-full transition-all duration-200 font-medium shadow-sm hover:shadow-md align-middle"
      >
        <IoArrowBackCircleOutline className="text-3xl" />
        {label}
      </Link>
    </div>
  );
}