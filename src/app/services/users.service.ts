import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { environment } from 'src/environments/environment.prod';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiURLUsers = environment.apiURL + 'users'

  constructor(private http: HttpClient) { }

  getUsers(): Observable <User[]> {
    return this.http.get<User[]>(this.apiURLUsers)
  }

  getUser(userId: string): Observable <User> {
    return this.http.get<User>(`${this.apiURLUsers}/${userId}`)
  }

  getUsersCount(): Observable<number> {
    return this.http.get<number>(`${this.apiURLUsers}/get/count`).pipe(map((objectValue: any) => objectValue.userCount));
  }

  createUser(user: User): Observable <User>{
    return this.http.post<User>(this.apiURLUsers, user)
  }

  updateUser(user: User): Observable <User>{
    return this.http.put<User>(`${this.apiURLUsers}/${user.id}`, user)
  }

  deleteUser(userId: string): Observable <Object>{
    return this.http.delete<Object>(`${this.apiURLUsers}/${userId}`)
  }
}
