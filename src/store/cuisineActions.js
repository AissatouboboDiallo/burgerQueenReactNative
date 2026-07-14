export const getMinutesElapsed = (dateCommande) => {
  // dateCommande est maintenant un nombre (millisecondes), pas un Timestamp Firestore
  const date = new Date(dateCommande);

  const diffMs = Date.now() - date.getTime();
  const totalMinutes = Math.floor(diffMs / 60000);

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const heures = Math.floor(totalMinutes / 60);
  const minutesRestantes = totalMinutes % 60;

  return minutesRestantes === 0 ? `${heures}h` : `${heures}h${minutesRestantes}`;
};