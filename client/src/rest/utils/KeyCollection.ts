export class KeyCollection<T> {
  private keySet: Set<T>;
  private keyArray: T[];
  private limitation: number;

  constructor(limitation: number) {
    this.keySet = new Set<T>();
    this.keyArray = [];
    this.limitation = limitation;
  }

  addKey(key: T) {
    if (!this.keySet.has(key)) {
      this.keySet.add(key);
      this.keyArray.push(key);

      if (this.keySet.size > this.limitation) {
        this.reduceKeys();
      }
    }
  }

  reduceKeys() {
    const removalCount = this.keySet.size - this.limitation;

    for (let i = 0; i < removalCount; i++) {
      const oldestKey = this.keyArray.shift();
      oldestKey && this.keySet.delete(oldestKey);
    }
  }

  hasKey(key: T) {
    return this.keySet.has(key)
  }

  clear(){
    this.keyArray = []
    this.keySet = new Set()
  }
}

type KeyCollectionType<T> = typeof KeyCollection<T>;
export type KeyCollectionInstanceType<T> = InstanceType<KeyCollectionType<T>>;

// Example usage
// const keyCollection = new KeyCollection<string>(1000); // Specify the limitation and key type
