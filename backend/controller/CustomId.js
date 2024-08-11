const generateCustomId = (prefix, number, isQuestion = false) => {
    const paddedNumber = number.toString().padStart(4, '0');
    if (isQuestion) {
      return `${prefix}PB${paddedNumber}`;
    }
    return `${prefix}${paddedNumber}`;
  };
  


  module.exports = generateCustomId;