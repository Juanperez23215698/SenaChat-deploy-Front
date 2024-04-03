import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../../../servidor';

@Injectable({
  providedIn: 'root'
})
export class FichasService {
  constructor(private http: HttpClient) { }
  traerFichas(){
    return this.http.get(`${url}/admin/fichas`);
  }
  traerProgramas(){
    return this.http.get(`${url}/admin/programas`);
  }
  agregarFicha(datos: any){
    return this.http.post(`${url}/admin/agregar-ficha`, datos);
  }
  traerFichaPorId(id: any){
    return this.http.get(`${url}/admin/ficha/${id}`);
  }
  editarFicha(datos: any, id: any){
    return this.http.put(`${url}/admin/editar-ficha/${id}`, datos);
  }
  traerGrupos(id: any) {
    return this.http.get(`${url}/admin/grupos/${id}`);
  }
}
