import 'dotenv/config';
import app from './app';
import { sequelize } from './database/models';

const port = Number(process.env.PORT ?? 4000);

async function main() {
  await sequelize.authenticate();
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
