import { Feature } from "geojson"

declare type ApiResponse<T> = {
  status: "OK" | "ERR" | "EXISTING" | "BANEDPWORD" | "WRONG" | "FIRSTTIME" | "PWORDCHANGE" | "REAUTH"
  data: T
  msg: unknown
}
declare type ApiAsyncResponse<T> = Promise<{
  status: "OK" | "ERR" | "EXISTING" | "BANEDPWORD" | "WRONG" | "FIRSTTIME" | "PWORDCHANGE" | "REAUTH"
  data: T
  msg: unknown
}>

declare type MapboxFeature = Feature & { source: "composite" | string, sourceLayer: "building" | string }

export type BEStoredGeometry = { x: number, y: number }[][][]

export type BEFeature = {
  amount: number
  id: string
  iso_3166_2: string
  lat: string
  lng: string
  name: string
  rating: string | number
  x: number
  y: number
  polygon: BEStoredGeometry
}