import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('../js/interface/settings.js',import.meta.url),'utf8');

test('les réglages permettent de choisir Cashpad ou Lightspeed',()=>{
 assert.match(source,/data-caisse-provider="cashpad"/);
 assert.match(source,/data-caisse-provider="lightspeed"/);
 assert.match(source,/fournisseurCaisseActuel\(\)/);
 assert.match(source,/fournisseur:'lightspeed'/);
});

test('Lightspeed K-Series est préparé avec OAuth côté serveur',()=>{
 assert.match(source,/Lightspeed Restaurant/);
 assert.match(source,/K-Series/);
 assert.match(source,/id="lightspeedEnvironment"/);
 assert.match(source,/id="lightspeedBusinessLocation"/);
 assert.match(source,/\{id:'financial-api'/);
 assert.match(source,/\{id:'orders-api'/);
 assert.match(source,/\{id:'items'/);
 assert.match(source,/\{id:'offline_access'/);
 assert.match(source,/data-lightspeed-flow="\$\{f\.id\}"/);
 assert.match(source,/Le client secret et les jetons Lightspeed ne seront jamais stockés dans ce navigateur/);
 assert.match(source,/st\.lightspeed=\{environnement,businessLocationId,flux,etat:'prepare'/);
 assert.doesNotMatch(source,/id="lightspeed(?:Password|Secret|Token)"/i);
});
