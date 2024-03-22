class ApiUtils {
    static URL = 'https://api.nytimes.com/svc/mostpopular/v2/emailed/7.json?api-key=';
    static key = 'pmnvMuGsYFhTOw7tumo7bpxUhbHJIrRn';

    static request(url, callback) {
        fetch(url)
            .then(response => {
                if (!response.ok) callback(null);
                return response.json();
            })
            .then(responseJSON => {
                callback(responseJSON)
            })
            .catch(error => console.log(error))
    }

    static getNews(callback) {
        this.request(this.URL + this.key, (data) => callback(data));
    }
}

export default ApiUtils; 