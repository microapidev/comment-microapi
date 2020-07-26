const mongoDaysFromToday = (mongoDate) => {
  const today = new Date().getTime();
  const endDate = new Date(mongoDate).getTime();
  const daysBetween = Math.ceil((endDate - today) / (1000 * 3600 * 24));
  return daysBetween;
};

module.exports = { mongoDaysFromToday };
