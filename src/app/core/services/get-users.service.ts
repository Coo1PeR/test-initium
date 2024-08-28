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

  // init local indexedDB for users
  private async initDB() {
    return openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true
          });
        }
      },
    });
  }

  // fetch users from api
  fetchUsersFromAPI(): Observable<Users[]> {
    return this.http.get<{ users: Users[] }>(this.URL)
      .pipe(
        // Extract users array from the response
        map(response => response.users)
      );
  }

  // get all users from local indexedDB
  async getAllUsers(): Promise<Users[]> {
    const db = await this.dbPromise;
    const users = await db.getAll(STORE_NAME);

    // if DB is empty, fetch users
    if (users.length === 0) {
      const fetchedUsers = await this.fetchUsersFromAPI().toPromise();

      // if users is fetched, save them in indexedDB and return
      if (fetchedUsers && fetchedUsers.length > 0) {
        for (let i = 0; i < fetchedUsers.length; i++) {
          fetchedUsers[i].id = i + 1;
          await this.addUser(fetchedUsers[i]);
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
    if (user.id) {
      await db.put(STORE_NAME, user);
    } else {
      const users = await db.getAll(STORE_NAME);
      user.id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
      await db.add(STORE_NAME, user);
    }
  }

  // Delete user
  async deleteUser(id: number): Promise<void> {
    const db = await this.dbPromise;
    await db.delete(STORE_NAME, id);
  }
}
