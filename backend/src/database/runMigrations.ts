import path from 'path';
import { Umzug, SequelizeStorage } from 'umzug';
import { Sequelize } from 'sequelize';
import { sequelize } from './sequelize';

// There is no shell access on the production host to run
// `sequelize-cli db:migrate` / `db:seed` (see CLAUDE.md), and
// `sequelize.sync()` in server.js only ever creates tables that don't
// exist yet — it never ALTERs an existing table's columns and never runs
// seeders. So schema changes and seed data added after a table was first
// created (by an earlier boot's `sync()`) never reach production on their
// own. This module runs the project's real `sequelize-cli`-style
// migration/seeder files itself, at boot, using the same underlying engine
// (umzug) and the same tracking table names (`SequelizeMeta` /
// `SequelizeData`) sequelize-cli itself would use — so this stays
// compatible if `sequelize-cli db:migrate` is ever run by hand later
// against the same database.
//
// Migrations/seeders are plain CommonJS `.js` files (intentionally, see
// backend/README.md) that export `up(queryInterface, Sequelize)` /
// `up(queryInterface)` — sequelize-cli's classic two-positional-argument
// style, not umzug's own single-object-argument style. The `resolve`
// below adapts one to the other.
const migrationsGlob = path.join(__dirname, '..', '..', 'src', 'database', 'migrations', '*.js');
const seedersGlob = path.join(__dirname, '..', '..', 'src', 'database', 'seeders', '*.js');

// Maps every "create table" migration to the table it creates. Used only
// once, the first time this ever runs against a given database: those
// tables already exist (created ad-hoc by `sequelize.sync()`), so instead
// of re-running `createTable` against a table that's already there (which
// would error), we mark that migration as already-applied — the same end
// state as if `sequelize-cli db:migrate` had created it originally. Any
// migration NOT in this map (a schema change to an existing table, or a
// data migration) always runs for real.
const CREATE_TABLE_MIGRATIONS: Record<string, string> = {
  '20260818023617-create-user.js': 'users',
  '20260822000001-create-admin.js': 'admins',
  '20260822000002-create-news-item.js': 'news_items',
  '20260822000003-create-event.js': 'events',
  '20260822000004-create-service.js': 'services',
  '20260822000005-create-team-member.js': 'team_members',
  '20260822000007-create-page.js': 'pages',
  '20260823000001-create-home-settings.js': 'home_settings',
  '20260823000002-create-activity.js': 'activities',
  '20260823000003-create-contact-message.js': 'contact_messages',
  '20260906000004-create-social-link.js': 'social_links',
};

function makeRunner(glob: string, metaModelName: string) {
  const storage = new SequelizeStorage({ sequelize, modelName: metaModelName });
  const umzug = new Umzug({
    migrations: {
      glob,
      resolve: ({ name, path: filePath, context }) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = require(filePath!);
        return {
          name,
          up: async () => mod.up(context, Sequelize),
          down: async () => mod.down?.(context, Sequelize),
        };
      },
    },
    context: sequelize.getQueryInterface(),
    storage,
    logger: console,
  });
  return { umzug, storage };
}

export async function runMigrationsAndSeeders(): Promise<void> {
  const { umzug: migrator, storage: migrationStorage } = makeRunner(migrationsGlob, 'SequelizeMeta');

  // First run ever against this database: adopt tables that already exist
  // (created by `sync()`) instead of trying to re-create them.
  const alreadyTracked = await migrator.executed();
  if (alreadyTracked.length === 0) {
    const queryInterface = sequelize.getQueryInterface();
    const existingTables = new Set(await queryInterface.showAllTables());
    for (const [migrationName, table] of Object.entries(CREATE_TABLE_MIGRATIONS)) {
      if (existingTables.has(table)) {
        await migrationStorage.logMigration({ name: migrationName });
      }
    }
  }

  const pendingMigrations = await migrator.pending();
  if (pendingMigrations.length > 0) {
    console.log(`Running ${pendingMigrations.length} pending migration(s): ${pendingMigrations.map((m) => m.name).join(', ')}`);
    await migrator.up();
  }

  const { umzug: seeder } = makeRunner(seedersGlob, 'SequelizeData');
  const pendingSeeds = await seeder.pending();
  if (pendingSeeds.length > 0) {
    console.log(`Running ${pendingSeeds.length} pending seeder(s): ${pendingSeeds.map((m) => m.name).join(', ')}`);
    await seeder.up();
  }
}
