import App from '../src/App';
import { getPublishedProjects } from '../src/lib/projects';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  return <App projects={await getPublishedProjects()} />;
}
