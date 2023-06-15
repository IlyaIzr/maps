type CBType = { cb: (arg?: any) => any, id?: string }

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

  public callAllCallbacks(args: any) {
    try {
      this.callbackStore.forEach(function iterator({cb}) {
        cb(args)
      })
      Object.entries(this.callbackUniqueStore).forEach(([id, { cb }]) => {
        cb(args)
        delete this.callbackUniqueStore[id]
      })
    } catch (error) {
      console.log('%c⧭ cb calling error: ', 'color: #e5de73', error);
    }
  }

  public callById(id: string, args: any) {
    this.callbackStore.forEach(({ cb, id: existingId }) => {
      if (id === existingId) cb(args)
    })
    this.callbackUniqueStore[id] && this.callbackUniqueStore[id].cb?.()
  }
}
