import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class LogearService {
  url = "mysql://u4u0okcmyjmw5reb:ZhHurKTg3hCg40ckVHSt@b3j38zupvodu63t4w42n-mysql.services.clever-cloud.com:3306/b3j38zupvodu63t4w42n";
  constructor(private http: HttpClient, private chat: ChatService) { }
  buscarDatos(datos: any) {
    return this.http.post(`${this.url}/usuario/login`, datos);
  }
  seleccionarFicha(ficha: any, numerodoc: any) {
    return this.http.put(`${this.url}/usuario/bienvenida/${numerodoc}`, ficha);
  }
  mandarCorreo(datos: any) {
    return this.http.post(`${this.url}/usuario/autenticar`, datos);
  }
  establecerCarga = () => this.chat.cambiarEstadoCarga(true);
}
