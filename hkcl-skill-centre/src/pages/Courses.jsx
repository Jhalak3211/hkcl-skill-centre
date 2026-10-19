import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import CourseCard from '../components/CourseCard.jsx';
import { FadeIn, FadeInStagger, FadeInItem } from '../components/MotionReveal.jsx';
import { categories, courses } from '../data/courses.js';

const cardVariantFor = (categoryId) => (categoryId === 'hcoc' ? 'compact' : 'default');

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');

  const requested = searchParams.get('category');
  const activeCategory = categories.some((c) => c.id === requested) ? requested : 'all';

  const setCategory = (id) => {
    const next = new URLSearchParams(searchParams);
    if (id === 'all') next.delete('category');
    else next.set('category', id);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    setQuery('');
    setCategory('all');
  };

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return courses.filter((course) => {
      if (activeCategory !== 'all' && course.category !== activeCategory) return false;
      if (!needle) return true;
      return [course.name, course.subtitle, course.summary]
        .filter(Boolean)
        .some((text) => text.toLowerCase().includes(needle));
    });
  }, [activeCategory, query]);

  const groups = categories
    .map((category) => ({ category, items: filtered.filter((c) => c.category === category.id) }))
    .filter((group) => group.items.length > 0);

  const countFor = (id) => (id === 'all' ? courses.length : courses.filter((c) => c.category === id).length);

  return (
    <>
      <Seo
        title="Courses"
        path="/courses"
        description="Browse HS-CIT programmes, HCOC career-oriented certificate courses and typing courses at HKCL Skill Centre, Sirsa, with listed durations and fees."
      />

      <section className="border-b border-brand-100/80 bg-white/60 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/50">
        <Container className="py-12 sm:py-16">
          <FadeIn>
            <SectionHeading
              as="h1"
              size="lg"
              title="Courses"
              intro="Durations and fees are as listed by the centre. Where a detail is not published, the page says so. Please confirm current fees and batch timings before you enrol."
            />
          </FadeIn>
        </Container>
      </section>

      <Container className="pt-8 sm:pt-10">
        <FadeIn className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
            {[{ id: 'all', label: 'All courses' }, ...categories].map((category) => {
              const selected = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setCategory(category.id)}
                  className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-all duration-200 active:scale-95 ${
                    selected
                      ? 'border-brand-800 bg-brand-800 text-white shadow-xs dark:border-blue-500 dark:bg-blue-600 dark:text-white dark:shadow-blue-900/30'
                      : 'border-brand-200/80 bg-white/80 text-brand-800 backdrop-blur-md hover:border-brand-400 hover:bg-brand-50 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-white/25 dark:hover:bg-slate-800/80'
                  }`}
                >
                  {category.label}{' '}
                  <span className={selected ? 'text-brand-200 dark:text-blue-200' : 'text-muted dark:text-slate-400'}>
                    ({countFor(category.id)})
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:max-w-xs">
            <label htmlFor="course-search" className="sr-only">
              Search courses
            </label>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-600 dark:text-blue-400 transition-colors"
              aria-hidden="true"
            />
            <input
              id="course-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses, e.g. Excel"
              className="min-h-11 w-full rounded-full border border-brand-200/80 bg-white/80 pl-10 pr-4 text-base text-brand-950 placeholder:text-muted backdrop-blur-md transition-all duration-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-blue-400 dark:focus:ring-blue-500/30"
            />
          </div>
        </FadeIn>

        <p role="status" className="mt-6 text-sm text-muted dark:text-slate-400">
          Showing {filtered.length} of {courses.length} courses
        </p>

        {groups.length === 0 ? (
          <FadeIn className="mt-6 rounded-2xl border border-dashed border-brand-300/80 bg-white/70 p-8 text-center backdrop-blur-md dark:border-white/20 dark:bg-slate-900/60">
            <h2 className="text-xl font-semibold text-brand-950 dark:text-white">No courses match your search</h2>
            <p className="mt-2 text-muted dark:text-slate-400">Try a shorter word, or clear the filters to see every course.</p>
            <Button variant="primary" className="mt-5" onClick={clearFilters}>
              Clear filters
            </Button>
          </FadeIn>
        ) : (
          groups.map(({ category, items }) => (
            <section key={category.id} aria-labelledby={`group-${category.id}`} className="mt-8 first-of-type:mt-4">
              <FadeIn>
                <h2 id={`group-${category.id}`} className="text-2xl font-semibold text-brand-950 dark:text-white">
                  {category.label}
                </h2>
                <p className="mt-1 text-muted dark:text-slate-400">{category.description}</p>
              </FadeIn>
              <FadeInStagger
                className={`mt-5 grid gap-5 sm:grid-cols-2 ${
                  cardVariantFor(category.id) === 'compact' ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-3'
                }`}
              >
                {items.map((course) => (
                  <FadeInItem key={course.slug}>
                    <CourseCard
                      course={course}
                      variant={cardVariantFor(category.id)}
                      showCategory={false}
                    />
                  </FadeInItem>
                ))}
              </FadeInStagger>
            </section>
          ))
        )}
      </Container>
    </>
  );
}
