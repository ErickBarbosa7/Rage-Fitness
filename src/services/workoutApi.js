const API_KEY = 'wx_91ee2f7b5fc4c48b5ace44167ee1db9b0d50b1a5cd15c1afdb9c6aa1'; 
export const fetchExternalExercises = async (muscle) => {
  const url = `https://exercisedb.p.rapidapi.com/exercises/muscle/${muscle}?limit=10`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    }
  };

  const response = await fetch(url, options);
  return await response.json();
};