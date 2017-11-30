import {Component, ApplicationRef} from '@angular/core';
import {NavController} from 'ionic-angular';
import PouchDB from 'pouchdb';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public data: any;
  private _db;
  private dbReady: boolean = false;
  private syncHandler: any;
  private syncOneHandler: any;

  private couchDbUrl: string = 'http://192.168.1.60:5984/';
  private dbName: string = 'playground';

  constructor(public navCtrl: NavController,
              public applicationRef: ApplicationRef) {
    // setInterval(() => {
    //   this.show();
    //   // this.changeDetector.markForCheck();
    // }, 1000);

  }

  initDB() {
    this._db = new PouchDB(this.dbName);
    console.log('initDB');
  }

  destroy() {
    this.destroyDB();
  }

  // private makeSomthing() {
  //
  //
  //
  //
  //
  //   //
  //   // //////////////////////////////////////////////////
  //   // this.destroyDB()
  //   //   .then(() => {
  //   //     this.initDB();
  //   //     this.replicateFromCouch('foo')
  //   //       .then(() => {
  //   //         this.updateSomeData('2', 'da')
  //   //           .then(() => {
  //   //             return this.replicateToCouch()
  //   //           })
  //   //       })
  //   //   });
  //   // /////////////////////////////////////////////////////
  //
  //
  //   // /////////////////////////////////////////////////////
  //   // this.replicateFromCouch('foo')
  //   //   .then(() => {
  //   //     this.updateSomeData('2', 'da da da da')
  //   //       .then(() => {
  //   //         return this.replicateToCouch()
  //   //       })
  //   //   })
  //   // /////////////////////////////////////////////////////
  //
  //
  //   // return this.updateSomeData('5', 'cccccccccccccccc')
  //   //   .then(response => {
  //   //     return this.replicateToCouch()
  //   //   })
  //
  //
  //   // this.updateSomeData('5', 'ccc')
  //   // this.replicateToCouch()
  //   // this.replicateFromCouch('')
  //   // .then(response => {
  //   //   return this.updateSomeData('5', 'ccc')
  //   //     .then(response => {
  //   //       return this.replicateToCouch()
  //   //     })
  //   // })
  //
  //
  //   // this.destroyDB()
  //   //   .then(()=>{
  //   //     this.initDB();
  //   //     return this.replicateFromCouch('')
  //   //   })
  //   //   .then(()=>{
  //   //     return this.updateSomeData('5', 'c c c')
  //   //   })
  //   //   .then(response => {
  //   //     return this.replicateToCouch()
  //   //   })
  //
  //
  //   // .then(()=>{
  //   //   return this.remove('5')
  //   // })
  //   // .then(response => {
  //   //   return this.replicateToCouch()
  //   // })
  //
  //
  //   //
  //   // this.put('4','data')
  //   //   .then(response => {
  //   //     return this.replicateToCouch()
  //   //   })
  //
  //
  //   // this.remove('3')
  //   //   .then(response => {
  //   //     this.replicateToCouch()
  //   //   })
  //
  //
  //   // this.replicateToCouch()
  //
  //
  //   // this.remove('1')
  //   //   .then(() => {
  //   //     return this.replicateToCouch()
  //   //   })
  //
  //
  //   //
  //   // this.replicateToCouch()
  //   //   .then(response => {
  //   //     console.log('Replication success', response);
  //   //   })
  //   //   .catch(err => {
  //   //     console.log('Replication error', err);
  //   //   });
  //
  //   //
  //   // this.replicateFromCouch('foo')
  //   //
  //   //   .then(response => {
  //   //     console.log('replicateFromCouch success', response);
  //   //     this.remove()
  //   //       .then(response => {
  //   //         console.log('this.remove()\n success', response);
  //   //
  //   //         this.replicateToCouch()
  //   //           .then(response => {
  //   //             console.log('Replication success', response);
  //   //           })
  //   //           .catch(err => {
  //   //             console.log('Replication error', err);
  //   //           });
  //   //       })
  //   //       .catch(err => {
  //   //         console.log('remove\n error', err);
  //   //       });
  //   //
  //   //   })
  //   //   .catch(err => {
  //   //     console.log('remove\n error', err);
  //   //   });
  //   //
  //
  //
  //   //
  //   // this.updateSomeData()
  //   //   .then(response => {
  //   //     console.log('updateSomeDatasuccess', response);
  //   //
  //   //
  //   //     this.replicateToCouch()
  //   //       .then(response => {
  //   //         console.log('Replication success', response);
  //   //       })
  //   //       .catch(err => {
  //   //         console.log('Replication error', err);
  //   //       });
  //   //   })
  //   //   .catch(err => {
  //   //     console.log('updateSomeData error', err);
  //   //   });
  //
  //
  //   // this.put()
  //   //   .then(response => {
  //   //     console.log('    this.put()\n success', response);
  //   //
  //   //     this.replicateToCouch()
  //   //       .then(response => {
  //   //         console.log('replicateToCouch success', response);
  //   //       })
  //   //       .catch(err => {
  //   //         console.log('replicateToCouch error', err);
  //   //       });
  //   //
  //   //
  //   //   })
  //   //   .catch(err => {
  //   //     console.log('    this.put()\n error', err);
  //   //   });
  //
  // }


  create() {
    this.put('test', 'client created')
  }

  update() {
    this.updateSomeData('test', 'client updated')
      .then(data => {
        this.show();
      })
      .catch(err => {
        this.data = 'ERROR:' + err;
      })
  }

  del() {
    this.remove('test');
  }

  show() {
    this.get('test')
      .then(data => {
        this.data = JSON.stringify(data);
        console.log('show this.data:', this.data);
        this.applicationRef.tick();
      })
      .catch(err => {
        this.data = 'ERROR:' + err;
        this.applicationRef.tick();
      })
  }

  showError(err) {
    this.data = err;
    this.applicationRef.tick();
  }


  replicateFromCouch(id): Promise<any> {
    console.log('replicateFromCouch invoked');
    const remoteUrl = this.couchDbUrl + this.dbName;
    let db = this._db;
    // by filter
    let options = {
      retry: true,
      // filter: 'app/by_agency',
      // query_params: {'agency_id': agency_id},
    };

    return db.replicate.from(remoteUrl, options)
      .on('complete', function (info) {
        console.log('DB replicateFromCouch complete', info);
        if (info.ok && info.status === 'complete') {
          console.log('DB Replication completed');
        }
      })
      .on("change", (change) => {
        console.log('replicateFromCouch change', change);
      })
      .on('paused', function (err) {
        console.log('replicateFromCouch paused');
      })
      .on('active', function () {
        // replicate resumed (e.g. new changes replicating, user went back online)
        console.log("replicateFromCouch Active...");
      })
      .on('denied', function (err) {
        // a document failed to replicate (e.g. due to permissions)
        console.log('replicateFromCouch denied', err)
      })
      .on('error', function (err) {
        console.log('replicateFromCouch error', err);
      });


  }

  replicateToCouch(): Promise<any> {
    console.log('replicateToCouch invoked');
    const remoteUrl = this.couchDbUrl + this.dbName;
    let me = this;
    // by filter
    let options = {
      retry: true,
      // filter: 'app/by_agency',
      // query_params: {'agency_id': agency_id},
    };
    return me._db.replicate.to(remoteUrl, options)
      .on('complete', function (info) {
        console.log('DB replicateToCouch:', info);
        if (info.ok && info.status === 'complete') {
          console.log('DB Replication completed');
        }
      })
      .on("change", (change) => {
        console.log('DB change', change);
      })

      .on('paused', function (err) {
        console.log('DB pouch db paused');
      })
      .on('active', function () {
        // replicate resumed (e.g. new changes replicating, user went back online)
        console.log("DB Pouch: Active...");
      })
      .on('denied', function (err) {
        // a document failed to replicate (e.g. due to permissions)
        console.log('DB pouch db denied', err)
      })
      .on('error', function (err) {
        console.log('DB pouch db error', err);
      });
  }

  destroyDB(): Promise<any> {
    return this._db.destroy()
      .then(function (response) {
        console.log('destroy :', response);
      })
      .catch(function (err) {
        console.log('ERROR: destroy', err)
      });
  }


  // Sync
  startSyncDoc(id: string) {
    const me = this;

    // by filter
    let options = {
      doc_ids: [id],
      live: true,
      retry: true,
      continuous: true,
      auto_compaction: true,
      revs_limit: 1
    };

    return new Promise((resolve, reject) => {
      const remoteUrl = this.couchDbUrl + this.dbName;
      me.syncOneHandler = me._db.sync(remoteUrl, options)
        .on('change', function (info) {
          console.log('startSyncDoc changes');
          me.handleChangeDoc(info);
        })
        .on('complete', function (info) {
          console.log('startSyncDoc sync complete');
        })
        .on('paused', function (err) {
          // replication paused (e.g. replication up to date, user went offline)
          console.log('SyncDoc paused');
          if (err) {
            console.log('SyncDoc paused with ERROR', err);
            return reject(err);
          }
          if (me.dbReady) {
            console.log("SyncDoc: Ready...");
          } else {
            console.log("SyncDoc: Waiting/Ready...");
            me.dbReady = true;
          }
          return resolve(me.dbReady);
        })
        .on('active', function () {
          // replicate resumed (e.g. new changes replicating, user went back online)
          console.log("startSyncDoc sync Active...");
          me.dbReady = false;
        })
        .on('denied', function (err) {
          // a document failed to replicate (e.g. due to permissions)
          console.log('SyncDoc sync denied', err)
        })
        .on('error', function (err) {
          console.log('SyncDoc sync error', err);
          reject(err);
        });
    });
  }

  stopSyncDoc() {

    if (this.syncOneHandler) {
      if (this.syncOneHandler.canceled) {
        console.log('stopSyncDoc sync canceled');
      } else {
        console.log('stopSyncDoc canceling sync Doc');
        this.syncOneHandler.cancel();
      }
    }
  }

  startSyncDB() {
    const me = this;
    const remoteUrl = this.couchDbUrl + this.dbName;
    // by filter
    let options = {
      live: true,
      retry: true,
      continuous: true,
      auto_compaction: true
    };

    return new Promise((resolve, reject) => {

      me.syncHandler = me._db.sync(remoteUrl, options)
        .on('change', function (info) {
          console.log('syncDB changes:', info);
          me.handleChanges(info);
        })
        .on('complete', function (info) {
          console.log('syncDB complete');

        })
        .on('paused', function (err) {
          // replication paused (e.g. replication up to date, user went offline)
          console.log('syncDB paused');
          if (err) {
            console.log('syncDB paused with ERROR', err);
            return reject(err);
          }

          if (me.dbReady) {
            console.log("syncDB Pouch: Ready...");
          } else {
            console.log("syncDB Pouch: Waiting/Ready...");
            me.dbReady = true;
          }
          return resolve(me.dbReady);
        })
        .on('active', function () {
          // replicate resumed (e.g. new changes replicating, user went back online)
          console.log("syncDB Active...");
          me.dbReady = false;
        })
        .on('denied', function (err) {
          // a document failed to replicate (e.g. due to permissions)
          console.log('syncDB denied', err)
        })
        .on('error', function (err) {
          console.log('syncDB error', err);
          reject(err);
        });
    });
  }

  stopSyncDB() {
    if (this.syncHandler) {
      if (this.syncHandler.canceled) {
        console.log('stopSyncDB canceled');
      } else {
        console.log('stopSyncDB canceling sync DB');
        this.syncHandler.cancel()
      }
    }
  }

  // Changes handlers
  handleChangeDoc(info) {
    console.log('handleChangeDoc:' + info.direction, info)
    if (info.change && info.change.docs) {
      info.change.docs.forEach(doc => {
        console.log('doc:', doc._id + 'was changed rev:', doc._rev);
      });
    }
    if (info.direction == 'pull') {
      console.log('PcrStoreProvider doc updates from COUCH');
    } else {
      console.log('PCRProvider updates from POUCH');
    }
    this.show();
  }

  handleChanges(info) {
    console.log('handleChanges')
    if (info.change && info.change.docs) {
      info.change.docs.forEach(doc => {
        console.log('doc:', doc._id + 'was changed rev:', doc._rev);
      });
    }

    if (info.direction == 'pull') {
      console.log('handleChanges updates from COUCH');
    } else {
      console.log('handleChanges updates from POUCH');
    }
    this.show();

  }

  private updateSomeData(id, data) {
    console.log('updateSomeData');
    const me = this;
    const db = this._db;
    return db.get(id)
      .then(function (doc) {
        console.log('get:', doc);
        doc.data = data;
        return db.put(doc);
      })
      .then(function (response) {
        console.log('updateSomeData put response:', response);
        return db.get(id);
      })
      .then(function (doc) {
        console.log('updateSomeData get:', doc);
      })
      .catch(function (err) {
        me.showError('ERROR on update:' + JSON.stringify(err));
        console.log('put', err)
      });
  }

  private put(id, data) {
    console.log('put');
    const db = this._db;
    return db.put({_id: id, data: data})
      .then(function (response) {
        console.log('put response:', response);
        return db.get(id);
      })
      .then(function (doc) {
        console.log('put get:', doc);
      })
      .catch(function (err) {
        console.log('put', err)
      });
  }

  private remove(id) {
    console.log('remove');
    const db = this._db;
    return db.get(id)
      .then(function (doc) {
        console.log('remove get:', doc);
        return db.remove(doc);
      })
      .then(function (response) {
        console.log('remove remove response:', response);
      })
      .catch(function (err) {
        console.log('remove ERROR', err)
      });
  }

  private get(id): Promise<any> {
    console.log('get');
    const db = this._db;
    return new Promise((resolve, reject) => {
      if (!db) return reject('no db');
      db.get(id)
        .then(function (data) {
          console.log('got:', data);
          resolve(data);
        })
        .catch(function (err) {
          reject('get ERROR' + err);
        });
    });


  }
}
