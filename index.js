function displayResults(responseJson) {
    console.log('displayResults ran');
    console.log(responseJson);
    //if there are previous results, remove them
    $('#results-list').empty();
    //iterate through the repos array
    for (let i = 0; i < responseJson.length; i++) {
        //for each repo object in the array, add a list item to the results list
        //with the repo's name and the URL to the repository
        console.log(responseJson[i].svn_url);
        console.log(responseJson[i].name);
        $('#results-list').append(
            `<li><p><a href="${responseJson[i].svn_url}" target="_blank">${responseJson[i].name}</a></p></li>`
        )
    }
    //display the results section
    $('#results').removeClass('hidden');
}

function getRepos(userEntry) {
    console.log('getRepos ran')

    //use GitHub's 'List repositories for a user' API, relacing the username with the userEntry argument
    const url = `https://api.github.com/users/${userEntry}/repos`;

    //replace accept header key with recommended value
    const options = {
        headers: new Headers({
            "accept": "application/vnd.github.v3+json"}),
    }

    //use Fetch API with url and options
    fetch (url, options)
        //if the response is ok, return the JSON as a JS object
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            //if not, throw an error
            throw new Error(response.statusText);
        })
        //then, run the responseJson object through the displayResults function
        .then(responseJson => displayResults(responseJson))
        //if something goes wrong, throw an error message
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function watchForm() {
    console.log('watchForm ran');
    //when the submit input on the form is clicked, ...
    $('form').submit(event => {
        event.preventDefault();
        //grab the entered input and set it to a variable
        const userEntry = $('#js-username-input').val().toLowerCase();
        console.log(`searching for ${userEntry}'s repos...`);
        //run userEntry through getRepo function
        getRepos(userEntry);
    })
}

//on page load, run watchForm
$(watchForm);