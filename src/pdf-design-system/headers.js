export const baseHeaders = {
  indexCardRadius: 18,
  dividerThickness: 1,
};

export const getHeaders = (scale = 1) => ({
  indexCardRadius: Math.round(baseHeaders.indexCardRadius * scale * 10) / 10,
  dividerThickness: Math.round(baseHeaders.dividerThickness * scale * 10) / 10,
});

export default getHeaders;
