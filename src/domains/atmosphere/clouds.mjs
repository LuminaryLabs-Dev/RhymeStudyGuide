// CSS transforms keep the three generated cloud layers independent of book selection.
export function renderClouds(link){
 return `<div class="cloud-layers" aria-hidden="true">${['bank','wisp','cluster'].map(name=>`<img class="cloud cloud-${name}" src="${link(`assets/world/cloud-${name}.webp`)}" alt="" decoding="async">`).join('')}</div>`;
}
