/* SWAY · accès classiques aux fiches techniques et à l'équipe, sans widgets. */
(function(){
 window.renderRecipesHub=function(){
  const recettes=st.carte||[];
  document.getElementById('s-recipes').innerHTML='<div class="classic-hub"><header><div><small>GESTION DES RECETTES</small><h1>Fiches techniques</h1><p>Retrouvez le coût et la composition de chaque recette.</p></div><button class="btn" id="newRecipe">Ajouter une recette</button></header><div class="classic-hub-list">'+(recettes.slice(0,20).map(function(c){return '<button class="classic-hub-row" data-recipe="'+c.id+'"><span>'+escapeHTML(c.i||'◇')+'</span><span><b>'+escapeHTML(c.n)+'</b><small>Ouvrir la fiche technique</small></span><i>›</i></button>'}).join('')||'<div class="classic-hub-empty">Aucune recette pour le moment.</div>')+'</div></div>';
  document.querySelectorAll('[data-recipe]').forEach(function(b){b.onclick=function(){openCarte(b.dataset.recipe)}});
  const add=document.getElementById('newRecipe');if(add)add.onclick=function(){openCarte()};
 };
 window.renderTeamHub=function(){
  const locaux=typeof utilisateursEtablissement==='function'?utilisateursEtablissement():[];
  const distants=window.equipeEnLigne&&Array.isArray(equipeEnLigne.membres)?equipeEnLigne.membres:[];
  const membres=distants.length?distants:locaux;
  document.getElementById('s-team').innerHTML='<div class="classic-hub"><header><div><small>COLLABORATION</small><h1>Équipe</h1><p>Gérez les personnes qui ont accès à Sway.</p></div><button class="btn" id="manageTeam">Gérer les accès</button></header><div class="classic-hub-list">'+(membres.slice(0,20).map(function(u){const nom=u.name||u.nom||u.email||'Membre de l’équipe';return '<div class="classic-hub-row"><span>'+escapeHTML(String(nom).charAt(0).toUpperCase())+'</span><span><b>'+escapeHTML(nom)+'</b><small>'+escapeHTML(u.poste||u.role||'Accès équipe')+'</small></span><em>Actif</em></div>'}).join('')||'<div class="classic-hub-empty">Les membres apparaîtront ici après leur invitation.</div>')+'</div></div>';
  const manage=document.getElementById('manageTeam');if(manage)manage.onclick=function(){openReglages('users')};
 };
})();
