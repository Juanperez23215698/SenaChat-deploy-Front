import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SesionService } from '../Sesiones/sesion.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MensajeEmitir } from '../Modelos/mensaje';
import { MensajesImagenComponent } from '../mensajes-imagen/mensajes-imagen.component';

@Component({
  selector: 'app-mensajes-enviar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MensajesImagenComponent],
  templateUrl: './mensajes-enviar.component.html',
  styleUrl: './mensajes-enviar.component.css'
})
export class MensajesEnviarComponent {
  constructor(
    protected Sesion: SesionService,
    private sanitizer: DomSanitizer
  ) { }

  @ViewChild(FormGroupDirective)
  formDirective !: FormGroupDirective;
  @Output() emitir = new EventEmitter<MensajeEmitir>();
  form = new FormGroup({
    contenido_mensaje: new FormControl('', Validators.required),
    archivo: new FormControl('')
  });
  archivos: string[] = [];
  noEnviar: boolean | undefined = true;
  offcanvasClass = '';

  longitud() {
    this.form.get('contenido_mensaje')?.value?.trim().length 
    ? this.noEnviar = false : this.noEnviar = true;
  }

  emitirEnvio(formValue: any) {
    formValue.archivo ? formValue.id_tipo = 'incluir tipo de mensaje' : formValue.id_tipo = '1';
    formValue.archivo ? formValue.contenido_mensaje = formValue.archivo : delete formValue.archivo;
    formValue.id_mensaje = undefined;
    this.emitir.emit(formValue);
    this.form.reset();
  }

  obtenerArchivo(event: any) {
    for (const key in event.files) {
      key !== 'length' && key !== 'item' ? this.convertFile(event.files[key]).then(
        (image: any) => {
          this.archivos.push(image);
        }
      ) : undefined;
    }
  }

  convertFile = async (file: File) => new Promise((resolve, reject) => {
    try {
      // const insegura = window.URL.createObjectURL(file);
      // const segura = this.sanitizer.bypassSecurityTrustUrl(insegura);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => { resolve(reader.result) };
    } catch (error) {
      console.error(error);
    }
  });

  cerrar() {
    this.archivos = [];
    this.form.reset();
  }
}
