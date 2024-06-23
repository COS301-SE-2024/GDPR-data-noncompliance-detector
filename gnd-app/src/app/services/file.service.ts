import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface FilePathResponse {
  status: string;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = 'http://127.0.0.1:8000/file-upload';

  constructor(private http: HttpClient) {}

  postNewFile(filePath: string): Observable<FilePathResponse> {
    return this.http.post<FilePathResponse>(this.apiUrl, { path: filePath });
  }
}
