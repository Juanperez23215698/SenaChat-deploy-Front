import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurarService {

  constructor(private http: HttpClient) { }
  url = 'mysql://u4u0okcmyjmw5reb:ZhHurKTg3hCg40ckVHSt@b3j38zupvodu63t4w42n-mysql.services.clever-cloud.com:3306/b3j38zupvodu63t4w42n';
  actualizarUsuario(Datos: any, numerodoc: any) {
    return this.http.put(`${this.url}/usuario/configurar/${numerodoc}`, Datos);
  }
}
