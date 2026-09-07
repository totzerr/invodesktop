/* Sway · tableau de bord officiel, relié aux données existantes. */
(function(){
 const icons={
  chart:'<svg viewBox="0 0 24 24"><path d="M5 20v-7m7 7V8m7 12V4"></path></svg>',
  pie:'<svg viewBox="0 0 24 24"><path d="M11 3a9 9 0 1 0 9 9h-9zM14 3v6h6a8 8 0 0 0-6-6"></path></svg>',
  box:'<svg viewBox="0 0 24 24"><path d="m4 7 8-4 8 4-8 4zM4 7v10l8 4 8-4V7m-8 4v10"></path></svg>',
  list:'<svg viewBox="0 0 24 24"><circle cx="5" cy="6" r="1"></circle><circle cx="5" cy="12" r="1"></circle><circle cx="5" cy="18" r="1"></circle><path d="M9 6h10M9 12h10M9 18h10"></path></svg>',
  trend:'<svg viewBox="0 0 24 24"><path d="m3 17 5-6 4 3 8-9m-4 0h4v4"></path></svg>',
  arrow:'<svg viewBox="0 0 24 24"><path d="M5 12h14m-5-5 5 5-5 5"></path></svg>',
  grip:'<svg viewBox="0 0 24 24"><circle cx="8" cy="6" r="1"></circle><circle cx="16" cy="6" r="1"></circle><circle cx="8" cy="12" r="1"></circle><circle cx="16" cy="12" r="1"></circle><circle cx="8" cy="18" r="1"></circle><circle cx="16" cy="18" r="1"></circle></svg>'
 };
 function jourDebut(date){const d=new Date(date);d.setHours(0,0,0,0);return d}
 function donnees(){
  const maintenant=new Date(),debut=jourDebut(maintenant),fin=new Date(debut);fin.setDate(fin.getDate()+1);
  const ventes=(st.mv||[]).filter(m=>m&&m.motif==='vente'&&new Date(m.ts)>=debut&&new Date(m.ts)<fin);
  const ca=ventes.reduce((s,m)=>s+pvMv(m),0),cout=ventes.reduce((s,m)=>s+coutMv(m),0),ratio=ca>0?cout/ca*100:0;
  const produits=st.prods||[],ruptures=produits.filter(p=>(st.stock[p.id]??0)<=0),bas=produits.filter(p=>{const q=st.stock[p.id]??0;return q>0&&q<=p.seuil});
  const debutSemaine=new Date(debut);debutSemaine.setDate(debutSemaine.getDate()-((debutSemaine.getDay()+6)%7));
  const jours=Array.from({length:7},(_,i)=>{const d=new Date(debutSemaine);d.setDate(d.getDate()+i);return{date:d,ca:0}});
  (st.mv||[]).filter(m=>m&&m.motif==='vente'&&new Date(m.ts)>=debutSemaine).forEach(m=>{const d=jourDebut(new Date(m.ts)),i=Math.floor((d-debutSemaine)/86400000);if(jours[i])jours[i].ca+=pvMv(m)});
  const commandes=(st.commandes||[]).filter(c=>c&&c.statut!=='recu'&&c.statut!=='annulee'),aRecevoir=commandes.filter(c=>c.dateLiv&&c.dateLiv<=maintenant.toISOString().slice(0,10));
  return{maintenant,ventes,ca,cout,ratio,ruptures,bas,jours,commandes,aRecevoir};
 }
 function premiereLettre(){const u=typeof utilisateurDashboardActuel==='function'?utilisateurDashboardActuel():null;return String((u&&u.nom)||st.who||'Thomas').trim().split(/\s+/)[0]||'Thomas'}
 function argent(v){return (Number(v)||0).toLocaleString('fr-FR',{minimumFractionDigits:0,maximumFractionDigits:0})+' €'}
 function carte(tone,icon,titre,corps,detail,cible){return '<section class="sway-widget sway-'+tone+'" data-widget-key="'+tone+'"><button class="sway-drag-handle" aria-label="Maintenir pour déplacer">'+icons.grip+'</button><header><span class="sway-widget-icon">'+icon+'</span><h2>'+titre+'</h2></header>'+corps+'<button class="sway-widget-link" data-dashgo="'+cible+'">'+detail+icons.arrow+'</button></section>'}
 function renduGraphique(jours){
  const max=Math.max(...jours.map(j=>j.ca),1),barres=jours.map(j=>{const hauteur=Math.max(j.ca?14:3,Math.round(j.ca/max*100));return '<div class="sway-bar" style="--bar:'+hauteur+'%"><span>'+argent(j.ca)+'</span><i></i><b>'+j.date.toLocaleDateString('fr-FR',{weekday:'short'}).replace('.','')+'</b></div>'}).join('');
  return '<section class="sway-widget sway-activity" data-widget-key="activity"><button class="sway-drag-handle" aria-label="Maintenir pour déplacer">'+icons.grip+'</button><div class="sway-chart-head"><header><span class="sway-widget-icon">'+icons.trend+'</span><div><h2>Activité de la semaine</h2><p>Chiffre d’affaires journalier</p></div></header><div><small>Cette semaine</small><strong>'+argent(jours.reduce((s,j)=>s+j.ca,0))+'</strong></div></div><div class="sway-bars">'+barres+'</div><button class="sway-widget-link" data-dashgo="bil">Ouvrir l’analyse'+icons.arrow+'</button></section>';
 }
 function renderDashboardOfficiel(){
  const d=donnees(),nom=premiereLettre(),date=d.maintenant.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'}),aVerifier=d.ruptures.length+d.bas.length;
  const ratioTexte=d.ca?d.ratio.toLocaleString('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1})+' %':'—';
  const ratioNote=d.ca?(d.ratio<=30?'Dans l’objectif':'Au-dessus de l’objectif'):'Ajoute des ventes pour calculer ce ratio';
  const taches=[];
  if(aVerifier)taches.push('<button class="sway-task" data-dashgo="stock"><span class="warning">!</span><span><b>'+aVerifier+' stock'+(aVerifier>1?'s':'')+' à vérifier</b><small>Quantités basses ou épuisées</small></span><i>›</i></button>');
  if(d.aRecevoir.length)taches.push('<button class="sway-task" data-dashgo="liv"><span class="receive">↓</span><span><b>'+d.aRecevoir.length+' réception'+(d.aRecevoir.length>1?'s':'')+'</b><small>À contrôler aujourd’hui</small></span><i>›</i></button>');
  if(!taches.length)taches.push('<button class="sway-task" data-dashgo="inv"><span class="ok">✓</span><span><b>Tout est à jour</b><small>Lancer un comptage si nécessaire</small></span><i>›</i></button>');
  const html='<div class="sway-dashboard"><header class="sway-dash-head"><div><small>'+date.toUpperCase()+'</small><h1>Bonjour '+escapeHTML(nom)+'</h1><p>Voici l’essentiel pour aujourd’hui.</p></div><span><i></i>Mis à jour à '+d.maintenant.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})+'</span></header><div class="sway-move-hint">'+icons.grip+'Maintiens un bloc pour le déplacer</div><div class="sway-widget-grid">'
   +carte('revenue',icons.chart,'Chiffre d’affaires','<strong class="sway-value">'+argent(d.ca)+'</strong><p class="sway-note">'+d.ventes.length+' vente'+(d.ventes.length>1?'s':'')+' enregistrée'+(d.ventes.length>1?'s':'')+' aujourd’hui</p><div class="sway-mini-line"></div>','Voir le détail','caisse')
   +carte('cost',icons.pie,'Coût matières','<strong class="sway-value">'+ratioTexte+'</strong><p class="sway-state '+(d.ca&&d.ratio>30?'alert':'')+'">'+(d.ca&&d.ratio<=30?'✓ ':'')+ratioNote+'</p><p class="sway-explain">'+(d.ca?'Sur 100 € vendus, '+d.ratio.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' € servent aux matières premières.':'Le détail reste disponible pour les gestionnaires.')+'</p>','Voir le détail','bil')
   +carte('stock',icons.box,'Stock','<strong class="sway-value compact">'+aVerifier+' produit'+(aVerifier>1?'s':'')+'</strong><p class="sway-stock-label">à vérifier aujourd’hui</p><p class="sway-stock-ok"><i></i>'+(aVerifier?'Le reste du stock va bien':'Aucune alerte de stock')+'</p>','Voir le stock','stock')
   +'<section class="sway-widget sway-tasks" data-widget-key="tasks"><button class="sway-drag-handle" aria-label="Maintenir pour déplacer">'+icons.grip+'</button><header><span class="sway-widget-icon">'+icons.list+'</span><h2>À faire aujourd’hui</h2></header><div class="sway-task-list">'+taches.slice(0,2).join('')+'</div></section>'
   +renduGraphique(d.jours)+'</div></div>';
  document.getElementById('s-dash').innerHTML=html;
  document.querySelectorAll('[data-dashgo]').forEach(b=>b.onclick=()=>{screen=b.dataset.dashgo;sq='';go()});
  requestAnimationFrame(()=>window.SwayWidgets&&window.SwayWidgets());
 }
 window.renderDash=renderDashboardOfficiel;
 document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();document.getElementById('swayGlobalSearch')?.focus()}});
 const search=document.getElementById('swayGlobalSearch');if(search)search.addEventListener('keydown',e=>{if(e.key==='Enter'&&search.value.trim()){sq=search.value.trim();screen='stock';go()}});
})();
