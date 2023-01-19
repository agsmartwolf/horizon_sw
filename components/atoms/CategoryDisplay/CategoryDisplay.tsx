import React from 'react';
import Image from 'components/atoms/SafeImage';
import Link from 'next/link';
import RichText from 'components/atoms/RichText';
import type { MandatoryImageProps } from 'types/global';

export interface CategoryDisplayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  image: MandatoryImageProps;
  title: string;
  description?: string;
  href: string;
}

const CategoryDisplay: React.FC<CategoryDisplayProps> = ({
  description,
  image,
  title,
  href,
  ...props
}) => (
  <div
    {...props}
    className={`flex flex-col space-y-4 overflow-visible ${props.className}`}>
    <Link href={href} className="relative overflow-hidden">
      <Image
        src={image.src}
        alt={image.alt}
        className={`rounded-image ${image.className}`}
        width={image.width}
        height={image.height}
      />
    </Link>
    <div className="flex flex-col space-y-1">
      <Link href={href}>
        <h4 className="font-headings text-md font-semibold text-black line-clamp-2">
          {title}
        </h4>
      </Link>
      {description && (
        <RichText
          className="block text-sm text-body line-clamp-2"
          content={description}
        />
      )}
    </div>
  </div>
);

export default CategoryDisplay;
