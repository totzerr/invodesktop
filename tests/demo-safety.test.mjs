import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const persistence=readFileSync(new URL('../js/workspace/persistence.js',import.meta.url),'utf8');
for(const action of ['chargerParcoursDemonstration(true)','resetDemo({silencieux:true,sauvegarder:false})']){
 test(`un espace connecté refuse ${action} sans modifier ses données`,async()=>{
  const state={stock:{bouteille:17},commandes:[{id:'real'}]};let writes=0;
  const ctx=vm.createContext({session:{supabase:true},st:state,toast:()=>{},Store:{set:()=>{writes++}}});
  vm.runInContext(persistence,ctx);
  assert.equal(await vm.runInContext(action,ctx),false);
  assert.equal(ctx.st,state);assert.equal(state.stock.bouteille,17);assert.equal(writes,0);
 });
}
test('les données de démo ne sont jamais envoyées par synchroniserEspaceSway',async()=>{
 let writes=0;
 const ctx=vm.createContext({st:{demoParcours:true},window:{SwaySupabaseAuth:{saveWorkspaceState:()=>{writes++}}}});
 vm.runInContext(readFileSync(new URL('../js/auth/session.js',import.meta.url),'utf8'),ctx);
 await vm.runInContext('synchroniserEspaceSway()',ctx);
 assert.equal(writes,0);
});
