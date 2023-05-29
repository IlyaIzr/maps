type CBType = { cb: () => any, id?: string }

export class CallbackManager {
  readonly id: string
  readonly callbackStore: CBType[] = []

  constructor(instanceId: string) {
    this.id = instanceId
  }

  public addCallback(cb: () => any, id?: string) {
    const cbObj: CBType = { cb }
    if (id) {
      cbObj.id = id
      if (this.callbackStore.find(({ id: existingId }) => existingId === id)) {
        console.warn('repeating callback id', id, cb)
      }
    }
    this.callbackStore.push(cbObj)
  }

  public callAllCallbacks() {
    this.callbackStore.forEach(({ cb }) => cb())
  }

  public callById(id: string) {
    this.callbackStore.forEach(({ cb, id: existingId }) => {
      if (id === existingId) cb()
    })
  }
}