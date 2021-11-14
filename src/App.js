import { Component } from "react";
import list from "./list";
import {sortBy} from 'lodash';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const DEFAULT_QUERY = 'react';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const DEFAULT_HPP = 100
const PARAM_HPP = "hitsPerPage="

const DEFAULT_PAGE = 0;
const PARAM_PAGE = 'page=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}&${PARAM_HPP}${DEFAULT_HPP}`;

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
}

// const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`
console.log(url)

function isSearched(searchTerm) {
  return function (item) {
    return !searchTerm || item.title.toLowerCase().includes(searchTerm);
  };
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      // list: null,
      lists : null,
      searchKey : '',
      searchItem: DEFAULT_QUERY,
      isLoading : false,
      
    };
    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.setTopStories = this.setTopStories.bind(this)
    
  }

  
  checkTopStoriesSearchTerm(searchTerm){
    return !this.state.lists[searchTerm];
  }

  setTopStories(result){
    // get the hits and page from result
    const {hits, page } = result;
    // meaning page in not 0, button has been clicked, page might be 1 or 2
    // old hits are already available in the state

    const oldhits = this.state.lists && this.state.lists[this.state.searchKey] ? this.state.lists[this.state.searchKey].hits : [];

    // const oldhits = page !== 0 ? this.state.list.hits : [];
    const updatedHits = [...oldhits, ...hits];
    // this.setState({list: {hits : updatedHits, page}})
    this.setState({ lists : {...this.state.lists, [this.state.searchKey] : {hits: updatedHits, page} }, isLoading: false })
  }

  fetchTopStories(searchTerm, page){
    this.setState({isLoading: true})
    // fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`).then(response => response.json() ).then(result => this.setState({list : result})).catch(e => e)
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`).then(response => response.json() ).then(result => this.setTopStories(result)).catch(e => e)
  }

  componentDidMount()
  {
    this.setState({ searchKey : this.state.searchItem })
    this.fetchTopStories(this.state.searchItem, DEFAULT_PAGE)
    
  }
  onSubmit(event){
    this.setState({ searchKey : this.state.searchItem })
    if(this.checkTopStoriesSearchTerm(this.state.searchItem)){
      this.fetchTopStories(this.state.searchItem, DEFAULT_PAGE);
    }
    
    event.preventDefault();
  }

  removeItem(id) {
    function isNotId(itemid) {
      return itemid.objectID !== id;
    }
    const {hits, page} = this.state.lists[this.state.searchKey]

    // create a new updated list
    const updated_list = hits.filter(isNotId);
    // assign the new updated list to the list using setstate method
    this.setState({lists: {...this.state.lists, [this.state.searchKey] : {hits : updated_list, page} }});
  } 

  searchValue(event) {
    this.setState({ searchItem: event.target.value });
  }
  // higher order function
  // a function which is defined outside the class and also it return a function

  render() {
    if(!this.state.lists){return null;}
    // const page = (this.state.lists && this.state.lists.page) || 0;
    const page = (this.state.lists && this.state.lists[this.state.searchKey] && this.state.lists[this.state.searchKey].page) || 0;
    const list = (this.state.lists && this.state.lists[this.state.searchKey] && this.state.lists[this.state.searchKey].hits) || [];
    
    return (
      <div className="App">
        <Search ssr={this.searchValue} onSubmit={ this.onSubmit } />
        <Table
          list={list}
          removeItem={this.removeItem}
          
        />
  

      { this.state.isLoading? <Loading /> :
        <button 
        onClick={() => this.fetchTopStories(this.state.searchItem, page+1)}>
          Load More
          </button>
      }


      </div>
    );
  }
}


// stateless function

const Search = ({ ssr, onSubmit }) => (
  <div className="cls1">
    <form onSubmit={ onSubmit }>
    <input type="text" onChange={ssr} />
    <button className="btn btn-success" type="submit">Search</button>
  </form>
  </div>
  
);

class Table extends Component {
  constructor(props){
    super(props);
    this.state = {
      sortKey: 'NONE',
      isSortReverse: false
    }
    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey){
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({sortKey, isSortReverse})
  }
  render(){
    const { list, sechItem, removeItem} = this.props;
    const {sortKey, isSortReverse} = this.state;
    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse?sortedList.reverse(): sortedList;
  
  return (
    
    <div>
      <div>
        <Sort sortKey = {'TITLE'} onSort = {this.onSort}>Title </Sort>
        <Sort sortKey = {'AUTHOR'} onSort = {this.onSort}> Author </Sort>
        <Sort sortKey = {'COMMENTS'} onSort = {this.onSort}> Comments </Sort>
        <Sort sortKey = {'POINTS'} onSort = {this.onSort}> Points </Sort>
      </div>

      {
      // list.filter(isSearched(searchItem)).map((item) => (
        // SORTS[sortKey](list).map(item=> 
        reverseSortedList.map(item=> 
        <div key={item.objectID}>
          <h1>
            <a href={item.url}> {item.title}</a> by {item.author}
          </h1>
          <h5>
            {item.num_comments} comments | {item.points} points
          </h5>
          <Buttons  onClick={() => removeItem(item.objectID)} />
          {/* <button type="button" onClick={() => removeItem(item.object_id)}>
            Remove Item
          </button> */}
        </div>
      )}
    </div>
  );
}}

class Buttons extends Component {
  render() {
    return (
      <button className="btn btn-danger" type="button" onClick={this.props.onClick}>
        Remove Item
      </button>
    );
  }
}

const Sort = ({ sortKey, onSort, children}) =>
<button
onClick={() => onSort(sortKey)}
>{children}</button>

const Loading = () => <div>Loading...</div>

export default App;