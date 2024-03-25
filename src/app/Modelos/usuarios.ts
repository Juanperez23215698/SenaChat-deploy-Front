interface DatosUsuario {
    correo: string;
    primer_nom: string;
    segundo_nom: string;
    primer_apellido: string;
    segundo_apellido: string;
    contrasena: string;
    nombre_usuario: string;
    descripcion: string;
    numerodoc: string;
    fk_id_tipodoc: number | string;
    id_fichas: string;
    foto: string;
    fk_id_rol: string;
}

export type Usuario = Partial<DatosUsuario>;