
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Monitor,
  BriefcaseBusiness,
  Keyboard,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Layers3,
  X,
} from 'lucide-react';

import Seo from '../components/Seo.jsx';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import CourseCard from '../components/CourseCard.jsx';
import {
  FadeIn,
  FadeInStagger,
  FadeInItem,
} from '../components/MotionReveal.jsx';
import { categories, courses, displayGroups } from '../data/courses.js';

// Normalise group data so a missing courseSlugs property cannot crash the page.
const safeDisplayGroups = (Array.isArray(displayGroups) ? displayGroups : []).map(
  (group) => ({
    ...group,
    courseSlugs: Array.isArray(group.courseSlugs) ? group.courseSlugs : [],
  }),
);

const publishedCourses = courses.filter(
  (course) => course.published !== false,
);

const getGroupIcon = (group) => {
  if (group.id === 'hs-cit') return Monitor;
  if (group.id === 'other') return Keyboard;

  if (
    group.id === 'business-management' ||
    group.id === 'accounting-office'
  ) {
    return BriefcaseBusiness;
  }

  return BookOpen;
};

const cardVariantFor = (categoryId) =>
  categoryId === 'hcoc' ? 'compact' : 'default';

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');

  const requestedCategory = searchParams.get('category');
  const requestedGroup = searchParams.get('group');

  const activeCategory = categories.some(
    (category) => category.id === requestedCategory,
  )
    ? requestedCategory
    : 'all';

  const activeGroup =
    safeDisplayGroups.find((group) => group.id === requestedGroup) || null;

  const hasSearch = query.trim().length > 0;

  const isBrowsingAll =
    activeCategory === 'all' && !activeGroup && !hasSearch;

  const updateFilters = (updates = {}) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    });

    setSearchParams(next, { replace: true });
  };

  const setCategory = (id) => {
    updateFilters({
      category: id === 'all' ? null : id,
      group: null,
    });
  };

  const setGroup = (groupId) => {
    updateFilters({
      category: null,
      group: groupId,
    });
  };

  const clearFilters = () => {
    setQuery('');
    setSearchParams({}, { replace: true });
  };

  const countForGroup = (group) =>
    publishedCourses.filter((course) =>
      group.courseSlugs.includes(course.slug),
    ).length;

  const filteredCourses = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return publishedCourses.filter((course) => {
      if (
        activeCategory !== 'all' &&
        course.category !== activeCategory
      ) {
        return false;
      }

      if (
        activeGroup &&
        !activeGroup.courseSlugs.includes(course.slug)
      ) {
        return false;
      }

      if (!needle) return true;

      return [
        course.name,
        course.subtitle,
        course.summary,
        course.description,
        course.category,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle));
    });
  }, [activeCategory, activeGroup, query]);

  const selectedCategory = categories.find(
    (category) => category.id === activeCategory,
  );

  const groupedResults = useMemo(() => {
    const results = safeDisplayGroups
      .map((group) => {
        const items = filteredCourses.filter((course) =>
          group.courseSlugs.includes(course.slug),
        );

        return {
          id: group.id,
          label: group.label,
          description: group.description,
          items,
          categoryId: items[0]?.category || 'hcoc',
        };
      })
      .filter((group) => group.items.length > 0);

    // Preserve courses that have not yet been assigned to a display group.
    const assignedSlugs = new Set(
      safeDisplayGroups.flatMap((group) => group.courseSlugs),
    );

    const ungrouped = filteredCourses.filter(
      (course) => !assignedSlugs.has(course.slug),
    );

    if (ungrouped.length > 0) {
      results.push({
        id: 'ungrouped-courses',
        label: 'Other Courses',
        description: 'Additional courses listed by the centre.',
        items: ungrouped,
        categoryId: ungrouped[0]?.category || 'short',
      });
    }

    return results;
  }, [filteredCourses]);

  const visibleGroups = activeGroup
    ? groupedResults.filter((group) => group.id === activeGroup.id)
    : activeCategory === 'hcoc'
      ? groupedResults.filter((group) =>
          group.items.some((course) => course.category === 'hcoc'),
        )
      : activeCategory === 'all'
        ? groupedResults
        : groupedResults.filter((group) =>
            group.items.some(
              (course) => course.category === activeCategory,
            ),
          );

  return (
    <>
      <Seo
        title="Courses"
        path="/courses"
        description="Explore HS-CIT programmes, HCOC career courses, computer education and typing courses at HKCL Skill Centre, Sirsa."
      />

      {/* Page introduction */}
      <section className="border-b border-brand-100 bg-slate-50">
        <Container className="py-10 sm:py-14">
          <FadeIn>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-orange-600">
              Learn. Practise. Grow.
            </p>

            <SectionHeading
              as="h1"
              size="lg"
              title="Explore Our Courses"
              intro="Find the right programme for your learning goals, from essential computer skills to career-oriented training and technical courses."
            />

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
              Course durations and fees are displayed where available.
              Please contact the centre to confirm current fees, batch
              timings and eligibility before enrolment.
            </p>
          </FadeIn>
        </Container>
      </section>

      <Container className="py-8 sm:py-12">
        {/* Prominent Course Search Bar & Quick Filters */}
        <FadeIn className="mb-8">
          <div className="mx-auto max-w-2xl">
            {/* Search Input Box */}
            <div className="relative flex items-center rounded-xl border-2 border-slate-300 bg-white shadow-xs transition-colors focus-within:border-brand-700 focus-within:ring-2 focus-within:ring-brand-700/20">
              <Search
                className="pointer-events-none absolute left-4 h-5 w-5 text-slate-500"
                aria-hidden="true"
              />
              <label htmlFor="course-search" className="sr-only">
                Search courses
              </label>
              <input
                id="course-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search courses..."
                className="min-h-13 sm:min-h-14 w-full rounded-xl bg-white pl-12 pr-11 text-base text-slate-900 placeholder:text-slate-500 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3.5 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Quick Category Filters */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setCategory('all')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  activeCategory === 'all' && !activeGroup && !hasSearch
                    ? 'bg-brand-800 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                All Programmes ({publishedCourses.length})
              </button>
              {categories.map((cat) => {
                const count = publishedCourses.filter((c) => c.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      activeCategory === cat.id && !activeGroup && !hasSearch
                        ? 'bg-brand-800 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {cat.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {/* Section heading */}
        <FadeIn>
          <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 mb-6">
            <h2 className="text-lg font-semibold text-brand-950">
              {hasSearch
                ? `Search results for "${query.trim()}"`
                : isBrowsingAll
                ? 'Browse by programme'
                : activeGroup?.label || selectedCategory?.label || 'Courses'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {hasSearch
                ? `${filteredCourses.length} ${filteredCourses.length === 1 ? 'course' : 'courses'} found matching your search.`
                : isBrowsingAll
                ? 'Choose a subject area or category above to explore courses.'
                : activeGroup?.description || selectedCategory?.description || 'Explore courses below.'}
            </p>
          </div>
        </FadeIn>

        {/* Overview: display all subject groups */}
        {isBrowsingAll && (
          <FadeInStagger className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {safeDisplayGroups.map((group) => {
              const Icon = getGroupIcon(group);
              const total = countForGroup(group);

              return (
                <FadeInItem key={group.id}>
                  <button
                    type="button"
                    onClick={() => setGroup(group.id)}
                    className="group flex h-full w-full flex-col rounded-2xl border border-brand-100 bg-white p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:p-6"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-800 transition-colors group-hover:bg-orange-100 group-hover:text-orange-700">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>

                    <div className="mt-5 flex flex-1 items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-brand-950">
                        {group.label}
                      </h3>

                      <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {total} {total === 1 ? 'course' : 'courses'}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {group.description}
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-800 group-hover:text-orange-600">
                      Explore courses
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                </FadeInItem>
              );
            })}
          </FadeInStagger>
        )}

        {/* Course results */}
        {!isBrowsingAll && (
          <>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-b border-brand-100 pb-4">
              <div>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-orange-600"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  All programmes
                </button>

                <h2 className="text-xl font-semibold text-brand-950">
                  {activeGroup?.label ||
                    selectedCategory?.label ||
                    'Search results'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredCourses.length}{' '}
                  {filteredCourses.length === 1 ? 'course' : 'courses'} found
                  {hasSearch ? ` for "${query.trim()}"` : ''}
                </p>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg border border-brand-200 px-3 py-2 text-sm font-medium text-brand-800 transition-colors hover:bg-brand-50"
              >
                Clear filters
              </button>
            </div>

            {filteredCourses.length === 0 ? (
              <FadeIn className="mt-6 rounded-2xl border border-dashed border-brand-200 p-8 text-center">
                <Search className="mx-auto h-8 w-8 text-slate-400" />

                <h3 className="mt-3 text-lg font-semibold text-brand-950">
                  No courses found
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  Try another search term or browse all programmes.
                </p>

                <Button
                  variant="primary"
                  className="mt-5"
                  onClick={clearFilters}
                >
                  Browse all programmes
                </Button>
              </FadeIn>
            ) : (
              <div className="mt-7 space-y-10">
                {visibleGroups.map((group) => (
                  <section
                    key={group.id}
                    aria-labelledby={`group-${group.id}`}
                  >
                    {(activeCategory === 'all' ||
                      activeCategory === 'hcoc') &&
                      !activeGroup && (
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-800">
                            <Layers3
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </div>

                          <div>
                            <h3
                              id={`group-${group.id}`}
                              className="text-lg font-semibold text-brand-950"
                            >
                              {group.label}
                            </h3>

                            <p className="mt-0.5 text-sm text-slate-500">
                              {group.items.length}{' '}
                              {group.items.length === 1
                                ? 'course'
                                : 'courses'}
                            </p>
                          </div>
                        </div>
                      )}

                    <FadeInStagger
                      className={`grid gap-5 sm:grid-cols-2 ${
                        cardVariantFor(group.categoryId) === 'compact'
                          ? 'lg:grid-cols-3 xl:grid-cols-4'
                          : 'lg:grid-cols-3'
                      }`}
                    >
                      {group.items.map((course) => (
                        <FadeInItem key={course.slug}>
                          <CourseCard
                            course={course}
                            variant={cardVariantFor(course.category)}
                            showCategory={false}
                          />
                        </FadeInItem>
                      ))}
                    </FadeInStagger>
                  </section>
                ))}
              </div>
            )}
          </>
        )}

        {/* Contact prompt */}
        {isBrowsingAll && (
          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-brand-100 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="font-semibold text-brand-950">
                Need help choosing a course?
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Contact the centre to discuss course details, fees and
                upcoming batches.
              </p>
            </div>

            <Button to="/contact" className="shrink-0">
              Contact the centre
            </Button>
          </div>
        )}
      </Container>
    </>
  );
}
