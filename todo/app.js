import React, { Component } from "react";
import { View, Text, StyleSheet, Platform, ListView, Keyboard} from "react-native";
import Header from "./header";
import Footer from "./footer";
import Row from "./row";

const filterItems = (filter, items) => {
  return items.filter((item) => {
    if (filter === "ALL") return true;
    if (filter === "COMPLETED") return item.complete;
    if (filter === "ACTIVE") return !item.complete;
  })
}
class App extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      allComplete: false,
      filter: "ALL",
      value: "",
      items:[],
      dataSource: ds.cloneWithRows([])
    }
    this.handleFilter = this.handleFilter.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.handleToggleComplete = this.handleToggleComplete.bind(this);
    this.setSource = this.setSource.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleToggleAllComplete = this.handleToggleAllComplete.bind(this);
  }
  setSource(items, itemsDatasource, otherState={}){
    this.setState({
      items,
      dataSource: this.state.dataSource.cloneWithRows(itemsDatasource),
      ...otherState
    })
  }
  handleFilter(filter) {
    this.setSource(this.state.items, filterItems(filter, this.state.items), {filter})
  }
  handleRemoveItem(key){
    const newItems = this.state.items.filter((item) => {
      return item.key !== key
    })
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  }
  handleToggleComplete(key, complete){
    const newItems = this.state.items.map((item) => {
      if (item.key !== key) return item;
      return {
        ...item,
        complete
      }
    })
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  }
  handleToggleAllComplete(){
    const complete = !this.state.allComplete;
    const newItems = this.state.items.map((items) => ({
      ...items,
      complete
    }))
    this.setSource(newItems, filterItems(this.state.filter, newItems), {allComplete: complete})
    
    // console.table(newItems); <-- like console.log()
    // this.setState({
    //   items: newItems,
    //   allComplete: complete
    // })
  }
  handleAddItem(){
    if(!this.state.value) return;
    const newItems = [
      ...this.state.items,
      {
        key: Date.now(),
        text: this.state.value,
        complete: false
      }
    ]
    this.setSource(newItems, filterItems(this.state.filter, newItems), {value: ""})
    // this.setState({
    //   items: newItems,
    //   value: ""
    // })
  }
  render(){
    return (
        <View style={styles.container}>
          <Header
            value={this.state.value}
            onAddItem={this.handleAddItem}
            onChange={(value) => this.setState({ value })}
            onToggleAllComplete={this.handleToggleAllComplete}
          />
          <View style={styles.content}>
            <ListView
              style={styles.list}
              enableEmptySections
              dataSource={this.state.dataSource}
              onScroll={() => Keyboard.dismiss()}
              renderRow={({key, ...value}) => {
                return (
                    <Row 
                      key={key}
                      onRemove={() => this.handleRemoveItem(key)}
                      onComplete={(complete) => this.handleToggleComplete(key, complete)}
                      {...value}
                    />
                  )
              }}
              renderSeparator={(sectionId, rowId) => {
                return <View key={rowId} style={styles.separator} />
              }}
            />
          </View>
          <Footer 
            count={filterItems("ACTIVE", this.state.items).length}
            onFilter = {this.handleFilter}
            filter={this.state.filter}
          />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    ...Platform.select({
      ios: { paddingTop: 30 }
    })
  },
  list: {
    backgroundColor: "#fff"
  },
  separator: {
    borderWidth: 1,
    borderColor: "#F5F5F5"
  },
  content: {
    flex: 1
  }
})

export default App;