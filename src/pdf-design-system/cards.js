export const baseCards = {
  radius: 16,
  borderWidth: 1,
  elevatedRadius: 20,
};

export const getCards = (scale = 1) => ({
  radius: Math.round(baseCards.radius * scale * 10) / 10,
  borderWidth: Math.round(baseCards.borderWidth * scale * 10) / 10,
  elevatedRadius: Math.round(baseCards.elevatedRadius * scale * 10) / 10,
});

export default getCards;
