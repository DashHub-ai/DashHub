import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

type SectionAllLinkProps = {
  href: string;
  label: string;
};

export function SectionAllLink({ href, label }: SectionAllLinkProps) {
  return (
    <Link href={href}>
      <a className="flex justify-between items-center text-gray-500 hover:text-gray-700 text-sm transition-colors">
        <span>{label}</span>
        <ArrowRight className="w-4 h-4" />
      </a>
    </Link>
  );
}
