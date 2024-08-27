import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Users} from "../interfaces/users";

@Injectable({
  providedIn: 'root'
})
export class GetUsersService {
  private URL: string =  'https://test-data.directorix.cloud/task1';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(`${this.URL}`);
  }
}
