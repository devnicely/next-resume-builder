function capitalizeFirstLetter(inputString: string): string {
  if (inputString?.length === 0) {
    return inputString; // Return unchanged if the string is empty
  }

  const firstLetter = inputString?.charAt(0).toUpperCase();
  const restOfString = inputString?.slice(1).toLowerCase();

  return firstLetter + restOfString;
}

export default capitalizeFirstLetter;
