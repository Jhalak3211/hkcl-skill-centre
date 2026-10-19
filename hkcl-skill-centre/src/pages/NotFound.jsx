import Seo from '../components/Seo.jsx';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';
import { FadeIn } from '../components/MotionReveal.jsx';

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" noindex />
      <Container className="py-20 text-center sm:py-28">
        <FadeIn>
          <p className="font-display text-6xl font-semibold text-brand-300 dark:text-brand-700 sm:text-7xl" aria-hidden="true">
            404
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-brand-950 dark:text-white sm:text-4xl">Page not found</h1>
          <p className="mx-auto mt-4 max-w-md text-muted dark:text-slate-400">
            The page you are looking for does not exist or has moved. Go back to the homepage or browse our courses.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/" size="lg">
              Back to homepage
            </Button>
            <Button to="/courses" variant="secondary" size="lg">
              Browse courses
            </Button>
          </div>
        </FadeIn>
      </Container>
    </>
  );
}
