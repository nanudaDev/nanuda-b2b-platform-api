export const GenderAgeModifier = (value?: string) => {
  if (!value) {
    return null;
  }
  let gender;
  let ageGroup;
  if (value.includes('M')) {
    gender = '님성';
  } else if (value.includes('F')) {
    gender = '여성';
  }
  //   value for age group
  if (value.includes('00')) {
    ageGroup = '10대 미만';
  }
  let ageSpliced = parseInt(value.substring(1));
  ageGroup = `${ageSpliced}대`;

  return `${ageGroup}/${gender}`;
};
