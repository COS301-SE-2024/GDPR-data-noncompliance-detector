// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class FileService {
//   private apiUrl = 'http://127.0.0.1:8000/reports';

//   constructor(private http: HttpClient) {}

//   getFiles(directory: string): Observable<string[]> {
//     console.log("Getting files")
//     return this.http.get<string[]>(`${this.apiUrl}?directory=${directory}`);
//   }
// }
