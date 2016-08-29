var Hashtag = React.createClass({
  rawMarkup: function() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return { __html: rawMarkup };
  },

  render: function() {
    if (typeof this.props.link != 'undefined')
      return (
        <div className="hashtag">
          <h2 className="hashtagText">
            <a href={'https://twitter.com/hashtag/' + this.props.link}>
              {this.props.children}
            </a>
          </h2>
        </div>
      );
    else {
      return (
        <div className="hashtag">
          <h2 className="hashtagText">
            {this.props.children}
          </h2>
        </div>
      );
    }
  }
});

var HashtagBox = React.createClass({
  handleHashtagSubmit: function(hashtag) {
    var hashtags = this.state.data;
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: hashtag,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: hashtags});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  render: function() {
    return (
      <div className="hashtagBox">
        <h1>#monkey</h1>
        <div className="mainInstruction"><strong>Enter a word</strong></div>
        <div className="secondaryInstruction">Enter a search term and we'll give you a bunch of stuff!</div>
        <HashtagForm onHashtagSubmit={this.handleHashtagSubmit} />
        <HashtagList data={this.state.data} />
      </div>
    );
  }
});

var HashtagList = React.createClass({
  render: function() {
    var hashtagNodes = this.props.data.map(function(hashtag) {
      if(hashtag.is_suggestion == 0) {
        return (
          <Hashtag key={hashtag.id} link={hashtag.text}>
            #{hashtag.text}
          </Hashtag>
        );
      } else {
        return (
          <Hashtag key={hashtag.id}>
            {hashtag.text}
          </Hashtag>
        );
      }
    });
    if (this.props.data.length == 0) {
      return (
        <div className="hashtagList">
          {hashtagNodes}
        </div>
      );
    }
    else {
      if (this.props.data[0].is_suggestion == 0) {
        return (
          <div className="hashtagListContainer">
            <div className="hashtagListHeader">Displaying results from <a href="http://www.twitter.com" target="blank">twitter.com</a></div>
            <div className="hashtagList">
              {hashtagNodes}
            </div>
          </div>
        );
      }
      else {
        return (
          <div className="hashtagListContainer">
            <div className="hashtagListHeader">No Hashtags matched your search, here are some suggestions from <a href="http://www.dictionary.com" target="blank">dictionary.com</a></div>
            <div className="hashtagList">
              {hashtagNodes}
            </div>
          </div>
        );
      }
    }
  }
});

var HashtagForm = React.createClass({
  getInitialState: function() {
    return {text: ''};
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var text = this.state.text.trim();
    if (!text) {
      return;
    }
    this.props.onHashtagSubmit({text: text});
    this.setState({text: ''});
  },
  render: function() {
    return (
      <form className="hashtagForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Search"
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Go!" />
      </form>
    );
  }
});

ReactDOM.render(
  <HashtagBox url="/api/hashtags" />,
  document.getElementById('content')
);