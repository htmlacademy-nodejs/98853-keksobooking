'use strict';

const db = require(`../database/db`);
const mongodb = require(`mongodb`);

class ImageStore {

  async getBucket() {
    if (this._bucket) {
      return this._bucket;
    }
    const dBase = await db;
    if (!this._bucket) {
      this._bucket = new mongodb.GridFSBucket(dBase, {
        chunkSizeBytes: 1024 * 1024,
        bucketName: `avatars`
      });
    }
    return this._bucket;
  }

  async get(id) {
    const bucket = await this.getBucket();
    const results = await (bucket).find({id}).toArray();
    const entity = results[0];
    if (!entity) {
      return void 0;
    }
    return {info: entity, stream: bucket.openDownloadStreamByName(filename)};
  }

  async save(id, stream) {
    const bucket = await this.getBucket();
    return new Promise((success, fail) => {
      stream.pipe(bucket.openUploadStream(id)).on(`error`, fail).on(`finish`, success);
    });
  }

}

module.exports = new ImageStore();
