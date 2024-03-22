/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  SafeAreaView,
  ScrollView
} from 'react-native';
import ApiUtils from './utils/ApiUtils';

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const App = () => {

  const defaultCategory = 'All';

  const [news, setNews] = useState([]);
  const [selectedNewsIndex, setSelectedNewsIndex] = useState(1);
  const [showNewsPage, setShowNewsPage] = useState(false);
  const [ogNews, setOgNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [loading, setLoading] = useState(false);
  const [screenLoading, setscreenLoading] = useState(false);


  useEffect(() => {
    getNews(1);
  }, []);


  useEffect(() => {
    if (selectedCategory == defaultCategory) {
      setNews([...ogNews]);
      return;
    }
    const newsDt = [...ogNews];
    const arr = newsDt.filter(item => item.section.includes(selectedCategory));
    setNews(arr);
  },
    [selectedCategory])

  const getNews = (type = 0) => {
    const SETLOOADING = type === 0 ? setLoading : setscreenLoading;
    SETLOOADING(true);
    ApiUtils.getNews(data => {
      console.log(data)
      SETLOOADING(false);
      if (data?.status === 'OK') {
        if (data.results?.length > 0) {
          const dataCat = [defaultCategory];
          data.results.forEach((news) => {
            if (news.section) {
              if (!dataCat.includes(news.section)) dataCat.push(news.section);
            }
          })
          setCategories(dataCat);
        }
        setNews(data.results);
        setOgNews(data.results);
      } else
        Alert.alert('ERROR', 'No data');
    })
  }
  const CategoriesList = () => {
    return <FlatList style={{ height: 50 }} horizontal={true} data={categories}
      renderItem={({ item, index }) => {
        return <TouchableOpacity style={[styles.componentsCat, { backgroundColor: item === selectedCategory ? 'lightblue' : 'lightgrey' }]}
          onPress={() => setSelectedCategory(item)}>
          <Text style={styles.category}>{item}</Text>
        </TouchableOpacity>
      }} />
  }

  const NewsList = () => {
    return <FlatList data={news}
      onRefresh={getNews}
      refreshing={loading}
      renderItem={({ item, index }) => {
        const { title, abstract, media, published_date } = item;
        let mediaItem = media[0];
        let url = ' ';
        if (mediaItem && mediaItem['media-metadata']) url = mediaItem['media-metadata'][1].url;
        return <TouchableOpacity style={styles.components}
          onPress={() => {
            setSelectedNewsIndex(index);
            setShowNewsPage(true);
          }}>
          <Text style={styles.title}> {title}</Text>
          <Image style={{
            width: '100%',
            height: 150,
          }} resizeMode={'cover'}
            source={{ uri: url }} />
          <Text style={styles.content}> {published_date}</Text>
          <Text style={styles.content} numberOfLines={3} ellipsizeMode={'tail'}> {abstract}</Text>

        </TouchableOpacity>
      }}
    />
  }
  const LoadingView = () => {
    return screenLoading ? <View style={{
      position: 'absolute',
      width: screenWidth,
      height: screenHeight,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.3)'
    }}>
      <ActivityIndicator size={'large'} color={'lightgreen'} />
    </View>
      : <View />
  }
  const NewsPage = () => {
    if (news[selectedNewsIndex]) {
      const { title, content, image_url } = news[selectedNewsIndex];
      return <Modal style={styles.newsPageCtnr}
        visible={showNewsPage}
        transparent={false}
        animationType={'slide'}>
        <SafeAreaView style={styles.screen} >
          <TouchableOpacity style={styles.closeButton}
            onPress={() => {
              setShowNewsPage(false);
            }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              flexDirection: "row"
            }}>{'X'}</Text>
          </TouchableOpacity>
          <ScrollView style={styles.newsPage}>
            <Text style={styles.title}>{title}</Text>
            <Image style={{
              width: '100%',
              height: 150,
            }}
              resizeMode={"cover"}
              source={{ uri: image_url }} />
            <Text >{content}</Text>
          </ScrollView>
        </SafeAreaView >
      </Modal>
    }
  }
  return <SafeAreaView style={styles.screen} >
    {CategoriesList()}
    {NewsList()}
    {LoadingView()}
    {NewsPage()}
  </SafeAreaView >
}
const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
    flex: 1,
  },
  components: {
    flexDirection: "column",
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  title: {
    width: screenWidth,
    paddingTop: 40,
    fontWeight: 'bold',
    borderRadius: 5,
    borderColor: " black",
    fontSize: 15,
  },
  content: {
    width: screenWidth,
    paddingTop: 20,
    fontSize: 13,
  },
  componentsCat: {
    height: 37,
    paddingHorizontal: 15,
    borderRadius: 15,
    justifyContent: 'center',
    marginHorizontal: 5
  },
  category: {
    fontWeight: "bold",
    fontSize: 13,
  },
  newsPageCtnr: {
    flex: 1,
    backgroundColor: '#fff'
  },
  closeButton: {
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: "center",
    alignSelf: 'flex-end'
  },
  newsPage: {
    width: screenWidth,
    height: screenHeight,
    paddingRight: 10,
    paddingLeft: 10,

  }
});
export default App;
