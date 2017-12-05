import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import {NavController} from 'ionic-angular';
import PouchDB from 'pouchdb';
import deltaPouch from 'delta-pouch';

PouchDB.plugin(deltaPouch);

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {


  _db: any;
  private dbName: string = 'playground';
  remoteCouch: string = 'http://192.168.1.60:5984/playground'; //(location.search ? 'https://delta-pouch.iriscouch.com' : 'http://127.0.0.1:5984') + '/profiles';
  // remoteCouch = (location.search ? 'https://delta-pouch.iriscouch.com' : 'http://127.0.0.1:5984') + '/websites';
  sites: any = [];
  curSite: any = null;

  form: any;

  constructor(public formBuilder: FormBuilder, public navCtrl: NavController) {
    this.form = this.formBuilder.group({
      name: [''],
      url: ['']
    });
  }

  originalInit(){


    this._db = new PouchDB('websites');
    this._db.deltaInit();
    const me = this;

    this._db.delta
      .on('_db.delta create', site => {
        console.log('on create', site);
        me.sites.push(site);
      })
      .on('_db.delta update', changes => {
        var site = me._db.merge(me.getSite(changes.$id), changes);
        me.updateSite(site);
      })
      .on('_db.delta delete', id => {
        me.deleteSite(id);
      });


    this._db.info((err, info) => {
      console.log('this.db.info finished info', info);
      me._db.changes({
        since: info.update_seq,
        live: true
      });
    });

    const opts = {live: true};
    this._db.replicate.to(this.remoteCouch, opts);
    this._db.replicate.from(this.remoteCouch, opts);

    this._db.all().then(docs => {

      for (var i in docs) {
        this.sites.push(docs[i]);
      }
    });
  }

  initDB() {
    const me = this;
    this._db = new PouchDB(this.dbName);
    this._db.deltaInit();

    this._db.delta
      .on('_db.delta create', site => {
        console.log('on create', site);
        me.sites.push(site);
      })
      .on('_db.delta update', changes => {
        var site = me._db.merge(me.getSite(changes.$id), changes);
        me.updateSite(site);
      })
      .on('_db.delta delete', id => {
        me.deleteSite(id);
      });
    console.log('initDB with delta Plugin');
  }

  destroy() {
    return this._db.destroy()
      .then(function (response) {
        console.log('destroy :', response);
      })
      .catch(function (err) {
        console.log('ERROR: destroy', err)
      });
  }

  purge() {
    const me = this;
    var promises = [];
    return this._db.allDocs({include_docs: true})
      .then(function (doc) {
        doc.rows.forEach(function (el) {
          promises.push(me._db.getAndRemove(el.doc._id));
        });
        return Promise.all(promises);
      });
  }

  doPurge() {
    this.purge().then(function () {
      console.log('purge done');
    });
  }

  cleanup() {
    this._db.cleanup().then(function () {
      console.log('cleanup done');
    });
  }





  setFormValues(site) {
    this.form.get('name').setValue(site.name ? site.name : '');
    this.form.get('url').setValue(site.url ? site.url : '');
    this.curSite = this._db.clone(site); // save so we can identify changes later
  }

  getFormValues() {
    const val = {name: this.form.get('name').value, url: this.form.get('url').value};
    console.log('getFormValues return val', val);
    return val;
  }

  setFormVisible(visible) {
    document.getElementById('form').style.display = visible ? 'block' : 'none';
    document.getElementById('newButton').style.display = !visible ? 'block' : 'none';
  }

  indexOf(id) {
    for (var i in this.sites) {
      if (this.sites[i].$id === id) {
        return i;
      }
    }
    return null;
  }

  getSite(id) {
    var i = this.indexOf(id);
    return i === null ? null : this.sites[i];
  }

  deleteSite(id) {
    var i = this.indexOf(id);
    if (i !== null) {
      this.sites.splice(i, 1);
    }
  }

  updateSite(site) {
    var i = this.indexOf(site.$id);
    if (i !== null) {
      this.sites[i] = site;
    }
  }


  editSite(id) {
    this.setFormValues(id ? this.getSite(id) : {});
    this.setFormVisible(true);
  }

  removeSite(id) {
    this._db.delete(id);
  }

  saveSite() {
    console.log('saveSite this.curSite', this.curSite)
    if (this.curSite.$id) { // existing?
      console.log('saveSite call saveChanges');
      this._db.saveChanges(this.curSite, this.getFormValues());
    } else {
      console.log('saveSite call saveNew');
      this._db.save(this.getFormValues());
    }
    this.setFormVisible(false);
  }


}

