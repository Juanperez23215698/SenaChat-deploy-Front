import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../Modelos/usuarios';


@Injectable({
  providedIn: 'root'
})
export class VisPerfilService {
  url = "mysql://u4u0okcmyjmw5reb:ZhHurKTg3hCg40ckVHSt@b3j38zupvodu63t4w42n-mysql.services.clever-cloud.com:3306/b3j38zupvodu63t4w42n";
  constructor(private http: HttpClient) { }

  buscarDatos(datos: any) {
    return this.http.get<Usuario>(`${this.url}/usuario/${datos}`);
  }
}
