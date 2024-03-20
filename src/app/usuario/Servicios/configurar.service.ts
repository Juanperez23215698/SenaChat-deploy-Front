import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurarService {

  constructor(private http: HttpClient) { }
  url = 'http://localhost:3000';
  actualizarUsuario(Datos: any, numerodoc: any) {
    return this.http.put(`${this.url}/usuario/configurar/${numerodoc}`, Datos);
  }
}
