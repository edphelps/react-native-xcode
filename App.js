/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

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
        <View style={styles.container}>
          <FlatList
            data={[
              {key: 'Devin'},
              {key: 'Jackson'},
              {key: 'James'},
              {key: 'Joel'},
              {key: 'John'},
              {key: 'Jillian'},
              {key: 'Jimmy'},
              {key: 'Julie'},
            ]}
            renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
          />
        </View>
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
