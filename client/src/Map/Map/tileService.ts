
// @ts-expect-error
import { getRange } from './range' // @ts-expect-error
import { getLayoutCoords } from "~rest/helperFuncs"; // @ts-expect-error
import { LAYOUT_ZOOM } from "../const"; // @ts-expect-error
import { getPlacesByTiles, getTagPlacesTiles } from '~requests/map'; // @ts-expect-error
import { setToast } from "~store/app"// @ts-expect-error
import { TEXT } from '~rest/lang'; // @ts-expect-error
import { geoJsonFromResponse } from './filters' // @ts-expect-error
import { addAppGeodata, removeAppGeodata } from '~store/map'
import type { Feature, MultiPolygon } from "geojson";
import type { ApiAsyncResponse, ApiResponse } from '~rest/types/types';
import type { Dispatch } from 'react';
import { KeyCollectionInstanceType, KeyCollection } from '~rest/utils/KeyCollection';

type TileCode = `x${number}y${number}`;
type Coordinates = { lat: number; lng: number }
type MapInteractiveData = { x: number; y: number, zoom: number }
type ModePayload = { mode: 'tags', tag: string } | undefined
type AnyFunction = (args?: any) => any

export class TileService {
  // encapsulated storages
  private tilesStack: Map<TileCode, Feature[] | null> = new Map();
  private tilesRequested: Set<TileCode> = new Set()
  private noDataCallbacks: Array<AnyFunction> = []
  private dataWasReceived = false
  // store empty tiles separately to reduce looping over tileStack 
  private emptyTiles: KeyCollectionInstanceType<TileCode>;
  private storedResponses: ApiResponse<Feature[]>[] = [];
  // settings
  private stackMaxSize: number;
  private stackReduceAmount: number;
  private requestMaxLength: number;
  private maxBatchesToWait = 8;
  private awaitTime = 300; //ms

  constructor(stackMaxSize: number, stackReduceAmount: number, requestMaxLength: number, emptyKeysLimit: number) {
    this.stackMaxSize = stackMaxSize;
    this.stackReduceAmount = stackReduceAmount;
    this.requestMaxLength = requestMaxLength;
    this.emptyTiles = new KeyCollection(emptyKeysLimit)
  }

  private collectTileCodesAroundCenter(center: MapInteractiveData, coords: Coordinates): Set<TileCode> {
    // const range = 10 || getRange(center.zoom)
    const range = getRange(center.zoom)
    const { lat, lng } = coords
    const { x: currentX, y: currentY } = getLayoutCoords(lng, lat, LAYOUT_ZOOM)

    // Go from top row to bottom
    const tilesWeNeed: Set<TileCode> = new Set()
    for (let yOffset = range; yOffset > -range - 1; yOffset--) {
      // From left to right (although in Mapbox y starts from top - North)
      for (let xOffset = -range; xOffset < range + 1; xOffset++) {
        const key: TileCode = `x${currentX + xOffset}y${currentY + yOffset}`
        if (this.tilesStack.has(key) || this.emptyTiles.hasKey(key)) {
          // escape from tilesWeNeed all keys already existing in tilesStack
          continue;
        }
        // Add data
        tilesWeNeed.add(key)
      }
    }
    return tilesWeNeed;
  }

  private async getFeaturesByTiles(tiles: TileCode[], modePayload: ModePayload): ApiAsyncResponse<Feature[]> {
    let response: ApiAsyncResponse<Feature[]>
    if (modePayload?.mode === 'tags') {
      response = getTagPlacesTiles(modePayload.tag, tiles)
    } else {
      response = getPlacesByTiles(tiles);
    }
    return response
  }

  // This method only updates store
  // private processPlacesResponse(res: ApiResponse<Feature[]>, d: Dispatch<any>): void {
  //   if (res.status !== 'OK') return setToast(d, {
  //     title: TEXT.networkError,
  //     message: typeof res.msg === 'object' ? JSON.stringify(res.msg) : res.msg || JSON.stringify(res.msg)
  //   })
  //   const geoJson = geoJsonFromResponse(res.data)
  //   addAppGeodata(d, geoJson)
  //   // Update current tile data

  //   // set feature per each tile
  //   // @ts-expect-error
  //   geoJson.forEach(feature => {
  //     const key: TileCode = `x${feature.x}y${feature.y}`
  //     const existedFeaturesInTile = this.tilesStack.get(key) || []
  //     existedFeaturesInTile.push(feature)
  //     this.tilesStack.set(feature.id, existedFeaturesInTile)
  //   })
  // }

  private removeByExpiredTiles(keysToDelete: TileCode[], featureIdsToDelete: string[], d: Dispatch<any>): void {
    keysToDelete.forEach((key) => {
      this.tilesStack.delete(key);
    });
    removeAppGeodata(d, featureIdsToDelete)
  }

  private clearStack(tilesWeNeed: Set<TileCode>): { keysToDelete: TileCode[], featureIdsToDelete: string[] } {
    if (this.tilesStack.size <= this.stackMaxSize) return { keysToDelete: [], featureIdsToDelete: [] };

    // Case we have more tiles that the limit has it. Lets delete some tiles
    const keysToDelete: TileCode[] = [];
    const featureIdsToDelete: string[] = [];
    let deletedCount = 0;

    for (const [key, featuresArr] of this.tilesStack) {
      if (!tilesWeNeed.has(key)) {
        // store tile keys to delete from tileStack
        // store all feature ids from that tile to delete it from appGeodata easily by id
        keysToDelete.push(key);
        featuresArr?.forEach(f => featureIdsToDelete.push(f.id || f.properties!.id))
        deletedCount++;

        if (deletedCount === this.stackReduceAmount) {
          break;
        }
      }
    }

    return { keysToDelete, featureIdsToDelete }
  }

  public async handleMapMove(
    center: MapInteractiveData, coords: Coordinates, d: Dispatch<any>, modePayload?: ModePayload
  ): Promise<void> {
    // console.log('%c⧭ handling MapMove modePayload', 'color: #40fff2', modePayload);
    const tilesWeNeed = this.collectTileCodesAroundCenter(center, coords);
    const { keysToDelete, featureIdsToDelete } = this.clearStack(tilesWeNeed);

    if (keysToDelete.length) this.removeByExpiredTiles(keysToDelete, featureIdsToDelete, d);

    const tilesWeNeedArr = Array.from(tilesWeNeed)
    const requestBatches: TileCode[][] = [];
    while (tilesWeNeedArr.length > 0) {
      const batch = tilesWeNeedArr.splice(0, this.requestMaxLength);
      requestBatches.push(batch);
    }

    // simple load algorithm
    // for (const batch of requestBatches) {
    //   const response = await this.getPlacesByTiles(batch);
    //   this.processPlacesResponse(response, d);
    // }

    // tiles load and await for each other to reduce map updates and blinking
    this.tilesRequested = tilesWeNeed
    for (const batch of requestBatches) {
      const responsePromise = this.getFeaturesByTiles(batch, modePayload);
      await this.collectResponses(responsePromise, d);
    }

    // Process any remaining stored responses
    if (this.storedResponses.length > 0) {
      this.proceedStoredResponses(d);
    }

    // Mark all remaining requested tiles as empty to avoid re-requesting them
    this.tilesRequested.forEach(tileKey => this.emptyTiles.addKey(tileKey))

    this.tilesRequested.clear()

    {
      if (!this.dataWasReceived) this.noDataCallbacks.forEach(cb => cb())
      this.dataWasReceived = false
    }
  }


  private async collectResponses(responsePromise: ApiAsyncResponse<Feature[]>, d: Dispatch<any>): Promise<void> {

    if (this.storedResponses.length >= this.maxBatchesToWait) {
      this.proceedStoredResponses(d);
    }

    const timeoutPromise = new Promise<null>((resolve) => setTimeout(resolve, this.awaitTime, null));

    // Wait for either the response or the timeout
    const response = await Promise.race([responsePromise, timeoutPromise]);

    if (response) {
      this.storedResponses.push(response);
    } else {
      // Timeout occurred, proceed with stored responses
      this.proceedStoredResponses(d);
    }
  }

  private proceedStoredResponses(d: Dispatch<any>): void {
    const responses = this.storedResponses;
    const geoJson: Feature[] = [];

    for (const response of responses) {
      if (response.status !== 'OK') {
        const errorMessage =
          typeof response.msg === 'object' ? JSON.stringify(response.msg) : response.msg || JSON.stringify(response.msg);
        setToast(d, {
          title: TEXT.networkError,
          message: errorMessage
        });
        continue;
      }

      const features = geoJsonFromResponse(response.data);

      // Here we store in tile stack all the tiles that have features
      features.forEach((feature: Feature<MultiPolygon, { x: number, y: number, id: number }>) => {
        // Save feature to tile stack
        const { x, y } = feature.properties
        const key: TileCode = `x${(x)}y${y}`;
        const existedFeaturesInTile = this.tilesStack.get(key) || [];
        existedFeaturesInTile.push(feature);
        this.tilesStack.set(key, existedFeaturesInTile);

        // Remove not-empty tiles from requested
        this.tilesRequested.delete(key)
      });
      geoJson.push(...features)
    }
    // Add geodata afterwards to avoid blinking
    addAppGeodata(d, geoJson);
    if (geoJson.length) this.dataWasReceived = true

    this.storedResponses.length = 0; // Clear the stored responses
  }

  public registerNoDataCallback(cb: AnyFunction) {
    this.noDataCallbacks.push(cb)
  }

  public cleanUp() {
    this.noDataCallbacks = []
    this.tilesStack.clear()
    this.tilesRequested.clear()
    this.dataWasReceived = false
    this.emptyTiles.clear()
    this.storedResponses = []
  }
}

export const tileServiceInstance = new TileService(200, 20, 100, 1000)