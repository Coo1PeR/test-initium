import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { from, map, Observable } from "rxjs";
import { Users } from "../interfaces/users";
import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'UsersDB';
const STORE_NAME = 'users';

@Injectable({
  providedIn: 'root'
})
export class GetUsersService {
  private URL: string = 'https://test-data.directorix.cloud/task1';
  private dbPromise: Promise<IDBPDatabase>;

  constructor(private http: HttpClient) {
    this.dbPromise = this.initDB();
  }

  private async initDB() {
    return openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, {keyPath: 'email'});
        }
      },
    });
  }

  fetchUsersFromAPI(): Observable<Users[]> {
    return this.http.get<{ users: Users[] }>(this.URL)
      .pipe(
        // Extract users array from the response
        map(response => response.users)
      );
  }

  async getAllUsers(): Promise<Users[]> {
    const db = await this.dbPromise;
    const users = await db.getAll(STORE_NAME);

    // if DB is empty, fetch users
    if (users.length === 0) {
      //TODO setTimeout
      const fetchedUsers = await this.fetchUsersFromAPI().toPromise();

      // if users is fetched, save them in indexedDB and return
      if (fetchedUsers && fetchedUsers.length > 0) {
        for (const user of fetchedUsers) {
          await this.addUser(user);
        }
        return fetchedUsers;
      } else {
        // Return empty array if there is no users
        return [];
      }
    }
    return users;
  }

  getAllUsersObservable(): Observable<Users[]> {
    return from(this.getAllUsers());
  }

  // Add and edit user
  async addUser(user: Users): Promise<void> {
    const db = await this.dbPromise;
    await db.put(STORE_NAME, user);
  }

  // Delete user
  async deleteUser(email: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete(STORE_NAME, email);
  }
}
