/**
 * LocalStorage implementation for persistence
 */

import { IStorage } from '../types';

export class LocalStorage implements IStorage {
  private storage: Map<string, any> = new Map();

  async save(key: string, data: any): Promise<void> {
    try {
      this.storage.set(key, JSON.parse(JSON.stringify(data)));
    } catch (error) {
      throw new Error(`Failed to save data to storage: ${error}`);
    }
  }

  async load(key: string): Promise<any> {
    try {
      const data = this.storage.get(key);
      if (data === undefined) {
        return null;
      }
      return JSON.parse(JSON.stringify(data));
    } catch (error) {
      throw new Error(`Failed to load data from storage: ${error}`);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      this.storage.delete(key);
    } catch (error) {
      throw new Error(`Failed to remove data from storage: ${error}`);
    }
  }

  async clear(): Promise<void> {
    try {
      this.storage.clear();
    } catch (error) {
      throw new Error(`Failed to clear storage: ${error}`);
    }
  }
}
