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
*  Format 5 to $5.00
*********************************************** */
function formatDollars(dollars) {
  return `$${dollars}.00`;
}

/* ********************************************
*  Cart
*********************************************** */
const Cart = ({ books }) => {
  console.log("-- Cart::render()");

  if (!books)
    return (
      <Text>loading...</Text>
    );

  const grandTotal = books.reduce((total, book) => {
    return total += (book.inCart) ? book.price : 0;
  }, 0);
  return (
    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>

      <View>
        <Text style={styles.cartTitle}>Cart</Text>
      </View>

      <View style={styles.cartTotalContainer}>
        <Text style={styles.cartTotal}>Cart total: {formatDollars(grandTotal)}</Text>
      </View>

    </View>
  );
};

/* ********************************************
*  BookList
   Displays list of books that match the search criteria and aren't in the cart
   books -- see App state
   searchCriteria -- see App state
   addToCartCB -- callback when user clicks to add book to cart, pass the book__id
}
*********************************************** */
// const BookList = ({
class BookList extends Component {
  // books,
  // searchCriteria,
  // addToCartCB,
  // removeFromCartCB }) => {

  /* **********************************
  *  constructor
  ************************************* */
  constructor(props) {
    super(props);
    this.state = {
      expandedBookIds: new Set(),
    };
  }

  /* **********************************
  *  onPressBuy()
  ************************************* */
  onPressBuy = (e, id) => {
    console.log('----------------------');
    console.log('onOPressBuy, id:', id);
    this.props.addToCartCB(id);
  }

  /* **********************************
  *  onPressReturn()
  ************************************* */
  onPressReturn = (e, id) => {
    console.log('----------------------');
    console.log('onOPressReturn, id:', id);
    this.props.removeFromCartCB(id);
  }

  /* **********************************
  *  onPressBook()
  ************************************* */
  onPressBook = (e, id) => {
    console.log('----------------------');
    console.log('onOPressBook, id:', id);
    // setExpandedBookCB(id);
  }

  /* **********************************
  *  render()
  ************************************* */
  render() {
    console.log('BookList::render()');

    // short circuit: still loading
    if (!this.props.books) {
      return (
        <Text>Loading book list...</Text>
      );
    }
    console.log("=======================")
    console.log(this.props.books)
    console.log("=======================")
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.books}
          renderItem={({item}) => (
            <View style={{flex: 1, flexDirection: 'row'}}>

              {(item.inCart)
                ? (<Button onPress={(e) => this.onPressReturn(e, item.id)} color="#000000" title="--- "/>)
                : (<Button onPress={(e) => this.onPressBuy(e, item.id)} color="#000099" title="Buy"/>)}

              <Text style={styles.item} onPress={(e) => this.onPressBook(e, item.id)} >{item.title}</Text>


            </View>
          )}
          keyExtractor={(item, index) => Number(item.id).toString()}
        />
      </View>
    )
  }

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

    let books = [...json];
    // json.forEach((book) => {
    //   newBook = {...book};
    //   newBook.id += 20;
    //   newBook.title = '2 ' + book.title;
    //   books.unshift(newBook);
    //   });
    // json.forEach((book) => {
    //   newBook = {...book};
    //   newBook.id += 40;
    //   newBook.title = '3 ' + book.title;
    //   books.unshift(newBook);
    //   });

    this.setState({
      books: books,
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
  *  removeFromCart()
  *  Called when user clicks to remove a book from the cart
  *  id -- book id
  ************************************* */
  removeFromCart = async (id) => {
    console.log('App:removeFromCart()');
    const response = await fetch(`http://localhost:8082/api/books/cart/remove/${id}`, {
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

        {/* Title */}
        <View style={{height: 100, backgroundColor: '#0066ff'}}>
          <Text style={styles.title}>Bookstore</Text>
        </View>

        {/* Cart */}
        <View style={{height: 80, backgroundColor: '#00cc66'}}>
          <Cart books={books} />
        </View>

        {/* BookList */}
        <BookList books={books} searchCriteria={searchCriteria} addToCartCB={this.addToCart} removeFromCartCB={this.removeFromCart} />
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  title: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 40,
    backgroundColor: '#0066ff',
    color: 'white',
  },

  item: {
    padding: 8,
    fontSize: 18,
    height: 44,
  },

  // itemInCart: {
  //   padding: 10,
  //   fontSize: 18,
  //   height: 44,
  //   color: '#000000',
  // },

  cartTitle: {
    padding: 10,
    fontSize: 30,
    fontWeight: 'bold',
  },

  cartTotalContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  cartTotal: {
    fontSize: 20,
    padding: 10,
    fontWeight: 'bold',
  },

});
