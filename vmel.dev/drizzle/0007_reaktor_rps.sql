INSERT INTO "projects" ("slug", "title", "summary", "body", "technologies", "kind", "status", "sort_order", "demo_url", "repository_url") VALUES (
  'reaktor-rps-statistics-platform',
  'Reaktor RPS · statistics platform',
  'Built and deployed a complete rock-paper-scissors statistics platform within a one-week assignment window, from unreliable upstream data to searchable matches and historical leaderboards.',
  $case$## A complete platform under a short deadline
The brief called for five views of a rock-paper-scissors dataset: latest results, matches by date, matches by player, today's leaders and a leaderboard for any date range. I built the React interface, Node API, data model and release setup myself. The initial implementation took shape over roughly five working days during the March 2026 assignment window; the repository also records later refinements.

This was a personal engineering assignment, not a client platform. Its value as a case is the range of decisions I had to make quickly: how to recover a large match history, handle inconsistent source records, keep current results fresh and make the service usable on my own VPS.

## Turning upstream history into dependable data
The source API returned history in cursor-linked pages and a separate live event stream. I built a backfill and incremental synchronization path that saves its cursor and progress in PostgreSQL. If the process stops, it can resume from its last checkpoint. A lock prevents overlapping runs, scheduled sync keeps the archive moving, and retries handle transient upstream failures.

Each page is normalized before storage. Matches are keyed by upstream game ID so repeated syncs can update records without creating duplicates. I validate moves, calculate winners, retain invalid-match information and refresh per-player daily aggregates for leaderboard queries. The data model and indexes support filtering by date and player without asking the upstream API for every page view.

## Fresh results without a permanent browser stream
For recent matches, the API reads the upstream Server-Sent Events feed in bounded sessions and holds a small cache. The browser polls that cached endpoint while a refresh is running. This separates many visitor requests from the protected upstream stream and avoids keeping a live connection open for every browser tab. It trades continuous streaming for a simpler, controlled refresh cycle that fit the assignment and the VPS.

## Five views from one model
I built the responsive React application around paginated match tables, player profiles and date-based filters. The same stored results feed latest matches, a chosen day, one player's history, today's ranking and historical rankings. A documented OpenAPI contract connects the frontend and API, and tests cover core match logic and interface behavior.

## Delivery on my own infrastructure
I deployed the frontend and containerized API on my VPS behind Nginx and HTTPS, with PostgreSQL for persistent history. The repository includes a GitHub Actions workflow that runs API and frontend tests before deployment. I owned the implementation end to end, including data ingestion, UI, server setup and release automation.$case$,
  ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Data synchronization', 'Docker', 'CI/CD']::text[],
  'personal', 'published', 1,
  'https://rps.vmel.dev/', 'https://github.com/non-rp/reaktor-rps'
) ON CONFLICT ("slug") DO NOTHING;
