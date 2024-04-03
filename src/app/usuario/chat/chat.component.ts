import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ChatService } from '../Servicios/chat.service';
import { MensajeEmitir, MensajeMostrar } from '../../Modelos/mensaje';
import { MensajesComponent } from '../mensajes/mensajes.component';
import { ChatDirective } from '../Directivas/chat.directive';
import { SesionService } from '../Sesiones/sesion.service';
import { GruposComponent } from '../grupos/grupos.component';
import { InfoGruposComponent } from '../info-grupos/info-grupos.component';
import { MensajesEnviarComponent } from '../mensajes-enviar/mensajes-enviar.component';
import { ChatComponentData } from '../../Modelos/chat';
import { Grupo } from '../../Modelos/grupos';
import { SocketService } from '../Servicios/socket.service';
import { Fecha } from '../../Modelos/fechas';
import { PerfilEditarComponent } from '../perfil-editar/perfil-editar.component';
import { MensajesVariosComponent } from '../mensajes-varios/mensajes-varios.component';
import { CerrarSesionComponent } from '../cerrar-sesion/cerrar-sesion.component';
import { ChatAnimacionComponent } from '../chat-animacion/chat-animacion.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MensajesComponent,
    ChatDirective,
    GruposComponent,
    InfoGruposComponent,
    MensajesEnviarComponent,
    PerfilEditarComponent,
    MensajesVariosComponent,
    CerrarSesionComponent,
    ChatAnimacionComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  constructor(
    private router: Router,
    private Chat: ChatService,
    protected Sesion: SesionService,
    private socket: SocketService
  ) { }
  @ViewChild('grupos') grupos: any;
  @Output() carga = new EventEmitter();
  datos = new ChatComponentData({ grupos: [], privados: [] }, {}, { changes: '0', cargando: true });
  grupoSeleccionado: string | null = '';
  fichaSeleccionada = this.Sesion.get('ficha');
  usuario = this.Sesion.get('documento');
  grupoElegido: Grupo | any;

  ngOnInit() {
    this.Sesion.remove('grupos'); this.Sesion.set('pestaña', 'grupos');
    this.Chat.eventoCarga.subscribe((estado: boolean) => this.datos.other.cargando = estado);
    if (this.fichaSeleccionada == undefined || this.usuario == undefined) {
      this.router.navigate(['login']);
      this.Sesion.set('error', 'No has iniciado sesion');
    } else {
      this.Chat.traerUsuario(this.usuario).subscribe((usuario: any) => this.datos.datosUsuario = usuario);
      this.Chat.traerGrupos(this.fichaSeleccionada, this.usuario).subscribe((grupos: any) => grupos != 'No hay grupos aun' ? this.extraerMensajes(grupos, 'grupos') : undefined);
      this.Chat.traerPrivados(this.fichaSeleccionada, this.usuario).subscribe((privados: any) => {
        if (privados != 'No hay privados aun') this.extraerMensajes(privados, 'privados');
        this.finalizarCarga();
      });
    }
  }

  ngAfterViewInit() {
    this.socket.recibirMensaje().subscribe((data: any) => this.añadirMensaje(data.message, 'meh', data.pn, data.pa));
    this.socket.notificaMensaje().subscribe((data: any) => this.añadirMensaje(data.message, 'meh', data.pn, data.pa, data.room, data.t));
  }

  enviar(mensaje: any, grupo: any) {
    let pn = this.datos.datosUsuario!.primer_nom;
    let pa = this.datos.datosUsuario!.primer_apellido;
    this.añadirMensaje({ ...mensaje }, this.usuario, pn, pa);
    this.Chat.destino(grupo, this.usuario).subscribe((id: any) => {
      mensaje.fk_destino = id;
      mensaje.fecha_hora = Fecha.fechaActual();
      this.Chat.agregarMensaje(mensaje).subscribe((insertId: any) => {
        insertId !== undefined && insertId !== null ? mensaje.id_mensaje = insertId : undefined;
        this.Chat.masNotificaciones({ u: this.usuario, g: grupo }).subscribe((data: any) => data ?
          this.socket.emitirMensaje({ room: grupo, message: mensaje, pn: pn, pa: pa, u: this.usuario, t: this.Sesion.get('pestaña') })
          : undefined);
      });
    });
  }

  applyChanges = (newValue: string[]) => {
    this.datos.other.changes = newValue[0];
    this.Sesion.set('grupos', newValue[1]);
    this.grupoSeleccionado = this.Sesion.get('grupos');
    this.grupoElegido = this.datos.gruposComponent[newValue[3]][newValue[2]];
  }

  extraerMensajes(data: any, location: string) {
    data.forEach((element: Grupo) => {
      this.socket.conectarEnGrupo(element.id_grupos);
      this.Chat.traerMensajes(element.id_grupos).subscribe((resultado: any) => {
        resultado ? resultado.forEach((value: MensajeMostrar) => {
          value.fecha_hora = new Date(value.fecha_hora);
        }) : undefined;
        element.mensajes = resultado ? resultado : [];
        this.datos.gruposComponent[location].push(element);
      });
    });
  }

  añadirMensaje(mensaje: MensajeEmitir, ...values: Array<any>) {
    const [numerodoc, primer_nom, primer_apellido, grupo, tipo] = values;
    mensaje.numerodoc = numerodoc;
    mensaje.primer_nom = primer_nom;
    mensaje.primer_apellido = primer_apellido;
    mensaje.fecha_hora = new Date();


    if (!grupo) this.grupoElegido.mensajes.push(mensaje);
    else {
      this.datos.gruposComponent[tipo].find((g: Grupo) => g.id_grupos == grupo)?.mensajes.push(mensaje);
      this.grupos.animarTab(tipo);
    }
  }

  sinGrupo() {
    this.grupoSeleccionado = '';
    this.Sesion.remove('grupos');
  }

  finalizarCarga = () => this.datos.other.cargando = false;

  ajustar(nuevosDatos: any) {
    this.datos.datosUsuario = nuevosDatos;
    this.Sesion.set('documento', nuevosDatos.numerodoc);
  };

  // copiar = (objeto: any) => { return { ...objeto }; };
}
