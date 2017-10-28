import { Component, Render, View, Animated, Button, TextView, Image, EventEmitter } from '../index';
import { styles } from './styles';

class MyComponent extends Component {
  constructor() {
    super();
    // interpolation animation
    this.spinAnimation = new Animated.Value(0);
  }
  render() {
    styles.secondaryView.transform = [this.spinAnimation];
    return (
      <Animated.View style={styles.mainView}>
        <Animated.View style={styles.secondaryView}></Animated.View>
        <View style={styles.spinner}>
          <Image style={styles.image} source={{uri:"icon_lock_white"}}></Image>
        </View>
      </Animated.View>
    );
  }
  spin() {
    Animated.timing(this.spinAnimation, {
      toValue: 360,
      duration: 5000
    }).start(()=>{
      this.spin();
    });
  }
  componentDidMount() {
    this.spin();
    EventEmitter.addListener('EventReminder', (message)=>{
      console.log('this event happened', message);
    })
  }
}

Render(MyComponent);
