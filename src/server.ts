import app from './app';
import mongoose from 'mongoose';
import config from './app/config';
import { Server } from 'http';
// database connection
let server: Server;
async function main() {
  try {
    await mongoose.connect(config.databaseURL as string);
    server = app.listen(config.port, () => {
      console.log('Server running on port 3000');
    });
  } catch (error) {
    console.log(error);
  }
}
main();
process.on('unhandledRejection', () => {
  console.log('unhandledRejection');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
    process.exit(1);
  }
});

process.on('uncaughtException', () => {
  console.log('uncaughtException');
  process.exit(1);
});


