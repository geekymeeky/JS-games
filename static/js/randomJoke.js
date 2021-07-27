const jokeEl = document.getElementById('joke');
const get_joke = document.getElementById('new_joke');
new_joke.addEventListener('click',another_joke);
another_joke();
async function another_joke(){
    // call api
        const jokesRes = await fetch('https://icanhazdadjoke.com/',{
            headers:{
                'Accept': 'application/json'
            }
        });
        const joke = await jokesRes.json()
        console.log(joke)
        jokeEl.innerHTML= joke.joke;
    // another new joke
}

