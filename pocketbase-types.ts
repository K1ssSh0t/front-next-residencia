/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	CategoriaPersona = "CategoriaPersona",
	Cuestionario = "Cuestionario",
	MediaSuperior = "Media_Superior",
	Preguntas = "Preguntas",
	Superior = "Superior",
	TipoBachiller = "TipoBachiller",
	TipoInstitucion = "TipoInstitucion",
	Usuario = "Usuario",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type CategoriaPersonaRecord = {
	descripcion?: string
}

export type CuestionarioRecord = {
	anio?: number
	carrera?: string
	idUsuario?: RecordIdString
}

export type MediaSuperiorRecord = {
	idTipoBachiller?: RecordIdString
	idTipoInstitucion?: RecordIdString
	idUsuario?: RecordIdString
	municipio?: string
	nombre?: string
	region?: string
}

export type PreguntasRecord = {
	cantidadHombres?: number
	cantidadMujeres?: number
	idCategoria?: RecordIdString
	idCuestionario?: RecordIdString
}

export type SuperiorRecord = {
	idTipoInstitucion?: RecordIdString
	idUsuario?: RecordIdString
	municipio?: string
	nombre?: string
	region?: string
}

export type TipoBachillerRecord = {
	descripcion?: string
}

export type TipoInstitucionRecord = {
	descripcion?: string
}

export type UsuarioRecord = {
	nivelEducativo?: boolean
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type CategoriaPersonaResponse<Texpand = unknown> = Required<CategoriaPersonaRecord> & BaseSystemFields<Texpand>
export type CuestionarioResponse<Texpand = unknown> = Required<CuestionarioRecord> & BaseSystemFields<Texpand>
export type MediaSuperiorResponse<Texpand = unknown> = Required<MediaSuperiorRecord> & BaseSystemFields<Texpand>
export type PreguntasResponse<Texpand = unknown> = Required<PreguntasRecord> & BaseSystemFields<Texpand>
export type SuperiorResponse<Texpand = unknown> = Required<SuperiorRecord> & BaseSystemFields<Texpand>
export type TipoBachillerResponse<Texpand = unknown> = Required<TipoBachillerRecord> & BaseSystemFields<Texpand>
export type TipoInstitucionResponse<Texpand = unknown> = Required<TipoInstitucionRecord> & BaseSystemFields<Texpand>
export type UsuarioResponse<Texpand = unknown> = Required<UsuarioRecord> & AuthSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	CategoriaPersona: CategoriaPersonaRecord
	Cuestionario: CuestionarioRecord
	Media_Superior: MediaSuperiorRecord
	Preguntas: PreguntasRecord
	Superior: SuperiorRecord
	TipoBachiller: TipoBachillerRecord
	TipoInstitucion: TipoInstitucionRecord
	Usuario: UsuarioRecord
	users: UsersRecord
}

export type CollectionResponses = {
	CategoriaPersona: CategoriaPersonaResponse
	Cuestionario: CuestionarioResponse
	Media_Superior: MediaSuperiorResponse
	Preguntas: PreguntasResponse
	Superior: SuperiorResponse
	TipoBachiller: TipoBachillerResponse
	TipoInstitucion: TipoInstitucionResponse
	Usuario: UsuarioResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'CategoriaPersona'): RecordService<CategoriaPersonaResponse>
	collection(idOrName: 'Cuestionario'): RecordService<CuestionarioResponse>
	collection(idOrName: 'Media_Superior'): RecordService<MediaSuperiorResponse>
	collection(idOrName: 'Preguntas'): RecordService<PreguntasResponse>
	collection(idOrName: 'Superior'): RecordService<SuperiorResponse>
	collection(idOrName: 'TipoBachiller'): RecordService<TipoBachillerResponse>
	collection(idOrName: 'TipoInstitucion'): RecordService<TipoInstitucionResponse>
	collection(idOrName: 'Usuario'): RecordService<UsuarioResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
