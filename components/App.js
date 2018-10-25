var GIPHY_API_URL = 'https://api.giphy.com';
var GIPHY_PUB_KEY = 'eByp0BaZfZZxgnEQlWCqD0J5LEqJYKyL';

App = React.createClass({

  getInitialState() {
    return {
      loading: false,
      searchingText: '',
      gif: {}
    };
  },

  handleSearch: function (searchingText) { // 1.
    this.setState({
      loading: true // 2.
    });
    // bylo tak: this.getGif(searchingText, function(gif) { - oczekujemy na pomyslne znalezienie gifa
    this.getGif(searchingText).then(response => // 3.
      this.setState({ // 4
        loading: false, // a
        //bylo: gif: gif,  
        gif: response, // b - o tu
        searchingText: searchingText // c
      })
      // bylo: }.bind(this)); - tu zwracamy blad - nie wiem, czemu musimy pozbyc sie bindowania....
    ).catch(error => console.error('Errrrrorrrr', error));
  },

  //bylo: getGif: function (searchingText, callback) { // 1.
  getGif: function (searchingText) { // 1.
    return new Promise(
      function (resolve, reject) {
        var url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText; // 2.
        var xhr = new XMLHttpRequest(); // 3.
        xhr.open('GET', url);

        xhr.onload = function () {
          if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText).data; // 4.
            var gif = { // 5.
              url: data.fixed_width_downsampled_url,
              sourceUrl: data.url
            };
            //bylo: callback(gif); // 6.
            resolve(gif);
          } else {
            reject(new Error(this.statusText)); // Dostaliśmy odpowiedź, ale jest to np 404
          }
        };
        xhr.onerror = function () {
          reject(new Error(
            `XMLHttpRequest Error: ${this.statusText}`));
        };
        xhr.send();
      });
  },

  render: function () {

    var styles = {
      margin: '0 auto',
      textAlign: 'center',
      width: '90%'
    };

    return ( <div style = {styles} ><h1> Wyszukiwarka GIFow! </h1> <p> Znajdź gifa na < a href = 'http://giphy.com' > giphy </a>. Naciskaj enter, aby pobrać kolejne gify.</p >
    <Search onSearch = {this.handleSearch} /> <
    Gif loading = {this.state.loading}  url = {this.state.gif.url}
    sourceUrl = {this.state.gif.sourceUrl}/> 
    </div>
);
}
});