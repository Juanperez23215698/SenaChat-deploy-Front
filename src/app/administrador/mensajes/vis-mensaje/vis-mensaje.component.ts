import { Component } from '@angular/core';
import { CrearMensajeComponent } from '../crear-mensaje/crear-mensaje.component';

@Component({
  selector: 'app-vis-mensaje',
  standalone: true,
  imports: [ 
    CrearMensajeComponent,
  ],
  templateUrl: './vis-mensaje.component.html',
  styleUrl: './vis-mensaje.component.css'
})
export class VisMensajeComponent {

  mostrar = false;
  mostrarCrear = () => this.mostrar = !this.mostrar;

}
