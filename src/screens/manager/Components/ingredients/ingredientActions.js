import React from 'react'

export default function ingredientActions() {
  const getPourcentage = (item) => {
    const pct = Math.round((item.quantiteActuelle / item.quantiteMax) * 100);
    return Math.max(0, Math.min(pct, 100));
};

const getColorProgress = (pct) => {
    if (pct <= 20) return '#EF4444';
    if (pct <= 50) return '#F59E0B';
    return '#22C55E';
};

return {getPourcentage , getColorProgress}
}
