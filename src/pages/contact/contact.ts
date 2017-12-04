import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import {NavController} from 'ionic-angular';
import PouchDB from 'pouchdb';
import deltaPouch from 'delta-pouch';

PouchDB.plugin(deltaPouch);

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {


  db: any;

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


    this.db = new PouchDB('websites');
    this.db.deltaInit();
    const me = this;

    this.db.delta
      .on('create', site => {
        console.log('on create:site', site);
        me.sites.push(site);
      })
      .on('update', changes => {
        var site = me.db.merge(me.getSite(changes.$id), changes);
        me.updateSite(site);
      })
      .on('delete', id => {
        me.deleteSite(id);
      });


    this.db.info((err, info) => {
      console.log('this.db.info finished info', info);
      me.db.changes({
        since: info.update_seq,
        live: true
      });
    });

    const opts = {live: true};
    this.db.replicate.to(this.remoteCouch, opts);
    this.db.replicate.from(this.remoteCouch, opts);

    this.db.all().then(docs => {

      for (var i in docs) {
        this.sites.push(docs[i]);
      }
    });

  }


  setFormValues(site) {
    this.form.get('name').setValue(site.name ? site.name : '');
    this.form.get('url').setValue(site.url ? site.url : '');
    this.curSite = this.db.clone(site); // save so we can identify changes later
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
    this.db.delete(id);
  }

  saveSite() {
    console.log('saveSite this.curSite', this.curSite)
    if (this.curSite.$id) { // existing?
      console.log('saveSite call saveChanges');
      this.db.saveChanges(this.curSite, this.getFormValues());
    } else {
      console.log('saveSite call saveNew');
      this.db.save(this.getFormValues());
    }
    this.setFormVisible(false);
  }


  purge() {
    const me = this;
    var promises = [];
    return this.db.allDocs({include_docs: true})
      .then(function (doc) {
        doc.rows.forEach(function (el) {
          promises.push(me.db.getAndRemove(el.doc._id));
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
    this.db.cleanup().then(function () {
      console.log('cleanup done');
    });
  }
}
