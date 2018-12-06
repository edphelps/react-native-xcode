/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, Button,
        TouchableOpacity, TextInput } from 'react-native';

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
*  Filter
*********************************************** */
const Filter = ({ filterChangedCB }) => {
  console.log("-- Filter::render()");

  return (
    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor:'#ff9999'}}>

      <View>
        <Text style={styles.filterLabel}>Filter:</Text>
      </View>

      <View>
        <TextInput
              autoFocus
              style={styles.filterInput}
              placeholder="book title"
              onChangeText={(text) => filterChangedCB(text)} />
      </View>
    </View>
  )
  // return (
  //   <View style={{flex: 1, backgroundColor:'pink'}}>
  //     <View style={{flex: 1, backgroundColor:'purple'}}>
  //       <Text style={styles.filterLabel}>Filter: </Text>
  //       <TextInput
  //             style={{height: 40}}
  //             placeholder="book title"
  //             onChangeText={(text) => filterChangedCB(text)} />
  //     </View>
  //   </View>
  // )
}

/* ********************************************
*  BookDetails
*********************************************** */
const BookDetails = ({ book }) => {
  console.log("-- BookDetails::render()");

  if (!book)
    return (
      <Text>no book to show details for??</Text>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.bookDetails}>{book.subtitle}</Text>
      <Text style={styles.bookDetails}>by {book.author}</Text>
      <Text style={styles.bookDetails}>{formatDollars(book.price)}, {book.pages} pages</Text>
      <Text style={styles.bookDetails}>{book.publisher}, {new Date(book.published).toLocaleString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' })}</Text>
      <Text style={styles.bookDetails}>{book.description}</Text>
      <Text style={styles.bookDetails}>{book.website}</Text>
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
class BookList extends Component {

  /* **********************************
  *  constructor
  ************************************* */
  constructor(props) {
    super(props);
    this.state = {
      expandedBookIdsSet: new Set(),
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
  *  Toggles whether to show book expanded details
  ************************************* */
  onPressBook = (e, id) => {
    // console.log('----------------------');
    console.log('onOPressBook, id:', id);

    const newSet = new Set(this.state.expandedBookIdsSet);
    // console.log('==============================')
    // console.log('state: ', this.state.expandedBookIdsSet)
    // console.log('==============================')
    // console.log('copied newSet: ', newSet)
    // console.log('==============================')
    if (newSet.has(id))
      newSet.delete(id);
    else
      newSet.add(id);
    // console.log('-----------------------------------------')
    // console.log('newSet: ', newSet)
    // console.log('-----------------------------------------')
    this.setState({
      expandedBookIdsSet: newSet,
      });
  }

  /* **********************************
  *  isBookExpanded()
  *  Checks if the book is in expanded state
  ************************************* */
  isBookExpanded(id) {
    // console.log('***** isBookExpanded, ', id);
    return this.state.expandedBookIdsSet.has(id);
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
    // console.log("=======================")
    // console.log(this.props.books)
    // console.log("=======================")
    let booksToDisplay = [];
    searchCriteria = this.props.searchCriteria;
    if (searchCriteria.text.length) {
      booksToDisplay = this.props.books.filter(book => book.title.toLowerCase().startsWith(searchCriteria.text.toLowerCase()));
    } else {
      booksToDisplay = this.props.books;
    }
    return (
      <View style={styles.container}>

        <FlatList

          data={booksToDisplay}
          extraData={this.state.expandedBookIdsSet}

          renderItem={({item}) => (
            <View style={{flex: 1, marginTop: 8, flexDirection: 'row'}}>

              {(item.inCart)
                ? (<Button onPress={(e) => this.onPressReturn(e, item.id)} color="#000000" title="cart"/>)
                : (<Button onPress={(e) => this.onPressBuy(e, item.id)} color="#000099" title="Buy"/>)}

              <View>
                <TouchableOpacity onPress={(e) => this.onPressBook(e, item.id)}>
                  <Text style={styles.bookTitle}  >{item.title}</Text>
                </TouchableOpacity>
                {(this.isBookExpanded(item.id))
                  ? (<BookDetails book={item} />)
                  : null}
              </View>
            </View>
          )}

          keyExtractor={(item, index) => Number(item.id).toString()}

        />
      </View>
    )
  }
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
    books: null,
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

    const newBooks = this.state.books.map((book) => {
      if (book.id === id) {
        const newBook = {...book};
        newBook.inCart = true;
        return newBook;
      }
      return book;
      });
    this.setState({
      books: newBooks,
    });
    // this.loadBooks();
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

    const newBooks = this.state.books.map((book) => {
      if (book.id === id) {
        const newBook = {...book};
        newBook.inCart = false;
        return newBook;
      }
      return book;
      });
    this.setState({
      books: newBooks,
    });
    // this.loadBooks();
  }

  /* **********************************
  *  filterChanged()
  *  Called as user types in the
  *  id -- book id
  ************************************* */
  filterChanged = (sFilter) => {
    console.log('App:filterChanged()');
    console.log('>>>> ', sFilter);
    newCriteria = this.state.searchCriteria;
    newCriteria.text = sFilter;
    this.setState({ searchCriteria: newCriteria });
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

        {/* Filter */}

        <View style={{height: 50, backgroundColor: '#00cc66'}}>
          <Filter filterChangedCB={this.filterChanged}/>
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

  bookTitle: {
    // paddingTop: 14,
    // paddingLeft: 8,
    // paddingRight: 8,
    // paddingBottom: 2,

    marginTop: 9,
    fontSize: 18,
    marginRight: 50,
    // height: 44,
    // backgroundColor: 'lightblue',
  },

  bookDetails: {
    fontSize: 13,
    padding: 0,
    marginTop: 3,
    marginLeft: 0,
    marginRight: 50,
    // fontWeight: 'bold',
    // backgroundColor: 'pink',
  },

  // itemInCart: {
  //   padding: 10,
  //   fontSize: 18,
  //   height: 44,
  //   color: '#000000',
  // },


  filterLabel: {
    padding: 10,
    fontSize: 18,
    // fontWeight: 'bold',
  },
  filterInput: {
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },


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
