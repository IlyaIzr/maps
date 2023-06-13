type CBType = { cb: () => any, id?: string }

export class CallbackManager {
  readonly id: string
  readonly callbackStore: CBType[] = []
  readonly callbackUniqueStore: Record<string, CBType> = {}

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

  public addRepetitiveCb(cb: () => any, id: string) {
    const cbObj: CBType = { cb }
    this.callbackUniqueStore[id] = cbObj
  }

  public callAllCallbacks() {
    try {
      this.callbackStore.forEach(({ cb }) => cb())
      Object.entries(this.callbackUniqueStore).forEach(([id, { cb }]) => {
        cb()
        delete this.callbackUniqueStore[id]
      })
    } catch (error) {
      console.log('%c⧭ cb calling error: ', 'color: #e5de73', error);
    }
  }

  public callById(id: string) {
    this.callbackStore.forEach(({ cb, id: existingId }) => {
      if (id === existingId) cb()
    })
    this.callbackUniqueStore[id] && this.callbackUniqueStore[id].cb?.()
  }
}