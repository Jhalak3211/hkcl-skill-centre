export default function SectionHeading({ title, intro, as: Tag = 'h2', id, className = '', size = 'md' }) {
  const sizeClass =
    size === 'lg' ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl lg:text-4xl';
  return (
    <div className={`max-w-2xl ${className}`}>
      <Tag id={id} className={`font-semibold text-brand-950 ${sizeClass}`}>
        {title}
      </Tag>
      {intro && <p className="mt-3 text-base text-muted sm:text-lg">{intro}</p>}
    </div>
  );
}
