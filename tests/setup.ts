import { DatabaseManager } from "../src/utils/DatabaseManager";

beforeAll(async () => {
  await DatabaseManager.initialize();
});

afterAll(async () => {
  // await DatabaseManager.destroy();
});