import React from "react";
import { StyleSheet, Text, View, Image, Animated, Dimensions, PanResponder } from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const ARTICLES = [
  { id: 1, uri: require("./assets/1.jpg") },
  { id: 2, uri: require("./assets/2.jpg") },
  { id: 3, uri: require("./assets/3.jpg") },
  { id: 4, uri: require("./assets/4.jpg") },
  { id: 5, uri: require("./assets/5.jpg") }
];

const styles = StyleSheet.create({
  container: { flex: 1 }
});

export default class App extends React.Component {
  constructor() {
    super();
    this.pos = new Animated.ValueXY();
    this.state = { currIndex: 0 };
    this.rotate = this.pos.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ["-10deg", "0deg", "10deg"],
      extrapolate: "clamp"
    });
    this.rotateAndTranslate = {
      transform: [
        {
          rotate: this.rotate
        },
        ...this.pos.getTranslateTransform()
      ]
    };
    this.likeOpacity = this.pos.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: "clamp"
    });
    this.dislikeOpacity = this.pos.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: "clamp"
    });
    this.nextCardOpacity = this.pos.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: "clamp"
    });
    this.nextCardScale = this.pos.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: "clamp"
    });
  }
  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gs) => true,
      onPanResponderMove: (e, gs) => {
        this.pos.setValue({ x: gs.dx, y: gs.dy });
      },
      onPanResponderRelease: (e, gs) => {
        if (gs.dx > 120) {
          Animated.spring(this.pos, { toValue: { x: SCREEN_WIDTH + 100, y: gs.dy } }).start(() => {
            this.setState({ currIndex: this.state.currIndex + 1 }, () => {
              this.pos.setValue({ x: 0, y: 0 });
            });
          });
        } else if (gs.dx < -120) {
          Animated.spring(this.pos, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gs.dy }
          }).start(() => {
            this.setState({ currIndex: this.state.currIndex + 1 }, () => {
              this.pos.setValue({ x: 0, y: 0 });
            });
          });
        } else {
          Animated.spring(this.pos, {
            toValue: { x: 0, y: 0 },
            friction: 4
          }).start();
        }
      }
    });
  }
  renderArticles = () =>
    ARTICLES.map((item, i) => {
      if (i < this.state.currIndex) {
        return null;
      } else if (i === this.state.currIndex) {
        return (
          <Animated.View
            key={item.id}
            style={[
              this.rotateAndTranslate,
              { height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: "absolute" }
            ]}
            {...this.panResponder.panHandlers}
          >
            <Animated.View
              style={{
                opacity: this.likeOpacity,
                position: "absolute",
                top: 50,
                left: 40,
                zIndex: 1000,
                transform: [{ rotate: "-30deg" }]
              }}
            >
              <Text
                style={{
                  borderWidth: 1,
                  borderColor: "green",
                  color: "green",
                  fontSize: 32,
                  fontWeight: "800",
                  padding: 10
                }}
              >
                LIKE
              </Text>
            </Animated.View>
            <Animated.View
              style={{
                opacity: this.dislikeOpacity,
                position: "absolute",
                top: 50,
                right: 40,
                zIndex: 1000,
                transform: [{ rotate: "-30deg" }]
              }}
            >
              <Text
                style={{
                  borderWidth: 1,
                  borderColor: "red",
                  color: "red",
                  fontSize: 32,
                  fontWeight: "800",
                  padding: 10
                }}
              >
                NOPE
              </Text>
            </Animated.View>
            <Image
              style={{ flex: 1, height: null, width: null, resizeMode: "cover", borderRadius: 20 }}
              source={item.uri}
            />
          </Animated.View>
        );
      }
      return (
        <Animated.View
          key={item.id}
          style={[
            { opacity: this.nextCardOpacity, transform: [{ scale: this.nextCardScale }] },
            { height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: "absolute" }
          ]}
        >
          <Image
            style={{ flex: 1, height: null, width: null, resizeMode: "cover", borderRadius: 20 }}
            source={item.uri}
          />
        </Animated.View>
      );
    }).reverse();
  render() {
    return (
      <View style={styles.container}>
        <View style={{ height: 60 }} />
        <View style={styles.container}>{this.renderArticles()}</View>

        <View style={{ height: 60 }} />
      </View>
    );
  }
}
