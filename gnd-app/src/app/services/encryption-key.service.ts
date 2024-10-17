import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncryptionKeyService {
  private apiUrl = 'http://localhost:3000/api/encryption-key';

  constructor(private http: HttpClient) {}

  getEncryptionKey(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}