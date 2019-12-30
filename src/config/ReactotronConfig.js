import Reactotron, {asyncStorage} from 'reactotron-react-native';
const tron = Reactotron.configure({host: '192.168.0.11'}) // controls connection & communication settings
  .useReactNative(asyncStorage()) // add all built-in react native plugins
  .connect();

console.tron = tron;
