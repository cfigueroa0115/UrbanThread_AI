import EmbeddedPostgres from 'embedded-postgres';
import { existsSync } from 'fs';

const dataDir = './backend/.pg-data';
const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: 'postgres',
  password: 'postgres',
  port: 5432,
  persistent: true,
});

async function main() {
  console.log('Starting PostgreSQL ...');
  
  const alreadyInitialized = existsSync(dataDir + '/PG_VERSION');
  
  if (!alreadyInitialized) {
    console.log('Initializing database for the first time...');
    await pg.initialise();
  } else {
    console.log('Database already initialized, starting...');
  }
  
  await pg.start();
  console.log('PostgreSQL running on port 5432');

  try {
    await pg.createDatabase('urbanthread_ai');
    console.log('Database "urbanthread_ai" created');
  } catch {
    console.log('Database "urbanthread_ai" already exists');
  }

  console.log('Connection: postgresql://postgres:postgres@localhost:5432/urbanthread_ai');
  console.log('Press Ctrl+C to stop.');

  process.on('SIGINT', async () => {
    console.log('Stopping PostgreSQL...');
    await pg.stop();
    process.exit(0);
  });
  process.on('SIGTERM', async () => {
    await pg.stop();
    process.exit(0);
  });
}

main().catch(async (err) => {
  console.error('Failed to start PostgreSQL:', err);
  try { await pg.stop(); } catch { /* ignore */ }
  process.exit(1);
});
