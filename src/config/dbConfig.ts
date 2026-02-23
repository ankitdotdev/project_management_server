import { Db, MongoClient } from "mongodb";


// Singleton Database manager to ensure only one MongoDB connection is used
class Database {
  private static db: Db;
  private static client: MongoClient;

  // Establishes connection to MongoDB (called once during app startup)
  static async connect(): Promise<void> {
    // Prevent multiple connections in case connect() is called again
    if (this.db) return;  
    this.client = new MongoClient(process.env.MONGO_URI!);

    await this.client.connect();

    this.db = this.client.db(process.env.DB_NAME!);

    console.log("Mongodb connected");
  }

  // Provides access to the initialized database instance
  static getDB(): Db {
    if (!this.db) {
      throw new Error("Database not connected. Call Database.connect() first.");
    }

    return this.db;
  }

  // Gracefully closes MongoDB connection (used during shutdown / tests)
  static async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      console.log("Mongodb connection is closed");
    }
  }
}

export default Database;
