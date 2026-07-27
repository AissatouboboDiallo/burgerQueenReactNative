export const getMinutesElapsed = (dateCommande) => {
  const date = new Date(dateCommande);

  const diffMs = Date.now() - date.getTime();
  const totalMinutes = Math.floor(diffMs / 60000);

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  if (totalMinutes < 1440) { // moins de 24h (24 * 60 = 1440)
    const heures = Math.floor(totalMinutes / 60);
    const minutesRestantes = totalMinutes % 60;
    return minutesRestantes === 0 ? `${heures}h` : `${heures}h${minutesRestantes}`;
  }

  // Au-delà de 24h, on affiche une vraie date plutôt qu'un nombre d'heures
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};