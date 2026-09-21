/** Section-heading block used at the top of every inner page (same type scale as the homepage sections). */
export function PageIntro({
  script,
  title,
  description,
}: {
  script: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <span className="font-script text-2xl sm:text-3xl text-gold font-semibold">{script}</span>
      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-chocolate tracking-tight mt-1">
        {title}
      </h1>
      {description && <p className="text-chocolate/70 text-sm sm:text-base mt-3">{description}</p>}
    </div>
  );
}
