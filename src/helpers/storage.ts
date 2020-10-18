import * as storage from 'electron-json-storage';

export class EuroosStorage {

    configPath: string;
    storage: any;

    constructor(path: string) {
        this.configPath = path;
        this.storage = storage;

        this.storage.setDataPath(this.configPath);
    }

}