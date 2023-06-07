export const generateID = () => {
  const currentYear = new Date().getFullYear();
  const randomNumber = Math.floor(Math.random() * 10000000000);
  const id = `${currentYear}_${randomNumber.toString().padStart(10, "0")}`;
  return id;
};
