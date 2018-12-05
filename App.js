/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, Button} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

/* ********************************************
*  BookList
   Displays list of books that match the search criteria and aren't in the cart
   books -- see App state
   searchCriteria -- see App state
   addToCartCB -- callback when user clicks to add book to cart, pass the book__id
}
*********************************************** */
const BookList = ({ books, searchCriteria, addToCartCB }) => {

  /* **********************************
  *  render()
  ************************************* */
  console.log('BookList::render()');

  // short circuit: still loading
  if (!books) {
    return (
      <Text>Loading book list...</Text>
    );
  }
  console.log("=======================")
  console.log(books)
  console.log("=======================")
  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={({item}) => (
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Button title="Buy"/>
            <Text style={styles.item}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );

  // let filteredBooks = [...books];
  //
  // // Apply search criteria
  // if (searchCriteria) {
  //   filteredBooks = filteredBooks.filter((book) => {
  //     switch (searchCriteria.authorOrTitle) {
  //       case 'author':
  //         return book.author.toLowerCase().startsWith(searchCriteria.text.toLowerCase());
  //       case 'title':
  //         return book.title.toLowerCase().startsWith(searchCriteria.text.toLowerCase());
  //       default:
  //         console.log('ERROR: bad searchCriteria.authorOrTitle: ', searchCriteria.authorOrTitle);
  //         return false;
  //     }
  //   });
  // };
  //
  // // short circuit: no books match search
  // if (!filteredBooks.length) {
  //   return (
  //     <div className="container">
  //     <h3>No books match the search</h3>
  //     </div>
  //   );
  // }
  //
  // // filter out books already in the cart
  // filteredBooks = filteredBooks.filter(book => !book.inCart);
  //
  // // short circuit: no books to display
  // if (!filteredBooks.length) {
  //   return (
  //     <div className="container">
  //       <h3>You bought everything!</h3>
  //     </div>
  //   );
  // }
  //
  // // sort by title
  // filteredBooks.sort((a, b) => {
  //   if (a.title < b.title) return -1;
  //   if (a.title > b.title) return 1;
  //   return 0;
  // });
  //
  // // render
  // return (
  //   <div className="container">
  //     <h3 className="text-center">Select a title to purchase</h3>
  //     <div className="list-group">
  //       { filteredBooks.map(book => <BookRowContainer key={book.id} book={book} addToCartCB={addToCartCB} />) }
  //     </div>
  //   </div>
  // );
};

/* *******************************************************
*  App
********************************************************** */
type Props = {};
export default class App extends Component<Props> {

  state = {
    searchCriteria: {
      text: '',
      authorOrTitle: 'author', // "title"
    },
    // ----------------
    // DON'T DELETE!!!!
    // ----------------
    // The following is loaded in compomnentDidMount
    // books: [ {
    //     "author": "Glenn Block, et al.",
    //     "description": "Design and build Web APIs for a broad ....",
    //     "id": 8,
    //     "inCart": true,
    //     "pages": 538,
    //     "price": 5,
    //     "published": "2014-04-07T00:00:00.000Z",
    //     "publisher": "O'Reilly Media",
    //     "subtitle": "Harnessing the Power of the Web",
    //     "title": "Designing Evolvable Web APIs with ASP.NET",
    //     "website": "http://chimera.labs.oreilly.com/books/1234000001708/index.html"
    //   },
    //   {...} ]
  }

  /* **********************************
  *  loadBooks()
  *  Load books from the api and setState()
  ************************************* */
  // async loadBooks() {
  loadBooks = async () => {
    console.log('App:loadBooks()');
    const response = await fetch('http://localhost:8082/api/books');
    const json = await response.json();
    console.log("****** books loaded", json)
    this.setState({
      books: json,
    });
  }

  /* **********************************
  *  componentDidMount()
  *  load the books and get rendering
  ************************************* */
  async componentDidMount() {
    console.log('App:componentDidMount()');
    this.loadBooks();
  }

  /* **********************************
  *  addToCart()
  *  Called when user clicks the add to cart button on a book
  *  id -- book id
  ************************************* */
  addToCart = async (id) => {
    console.log('App:addToCart()');
    const response = await fetch(`http://localhost:8082/api/books/cart/add/${id}`, {
      method: 'PATCH',
      body: '',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const json = await response.json();
    console.log('resulting json: ' + json);
    this.loadBooks();
  }

  /* **********************************
  *  render
  ************************************* */
  render() {
    const { books, searchCriteria } = this.state;
    return (
      <View style={styles.container}>

        <View style={{height: 100, backgroundColor: 'powderblue'}}>
          <Text style={styles.heading}>Bookstore 1</Text>
        </View>

        <BookList books={books} searchCriteria={searchCriteria} addToCartCB={this.addToCart} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 40,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
