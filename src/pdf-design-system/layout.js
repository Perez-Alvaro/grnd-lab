export const layoutVariants = {
  desktop: 1,
  mobile: 0.85,
};

export const getScaleForVariant = (variant = "desktop") =>
  layoutVariants[variant] || layoutVariants.desktop;

export default getScaleForVariant;
