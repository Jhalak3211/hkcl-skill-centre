export default function Container({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
