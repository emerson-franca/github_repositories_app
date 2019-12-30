import React, {Component} from 'react';
import {Keyboard, ActivityIndicator, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';

import {
  Container,
  Input,
  SubmitButton,
  Form,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
  RemoveButton,
  RemoveButtonText,
} from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';

export default class Main extends Component {
  state = {
    newUser: '',
    users: [],
    loading: false,
  };

  static navigationOptions = {
    title: 'Usuários',
  };

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');
    if (users) {
      this.setState({users: JSON.parse(users)});
    }
  }

  componentDidUpdate(_, prevState) {
    const {users} = this.state;

    if (prevState.users != users) {
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  addUser = async () => {
    const {users, newUser} = this.state;

    this.setState({loading: true});

    try {
      const response = await api.get(`/users/${newUser}`);
      const data = {
        name: response.data.name,
        login: response.data.login,
        bio: response.data.bio,
        avatar: response.data.avatar_url,
      };

      this.setState({
        users: [...users, data],
        newUser: '',
        loading: false,
      });
    } catch (error) {
      alert(error);
      this.setState({
        newUser: '',
        loading: false,
      });
    }

    Keyboard.dismiss();
  };

  removeUser = name => {
    console.tron.log('name', name);
    const filteredUsers = this.state.users.filter(user => {
      return user.name != name;
    });
    console.tron.log('filtered', filteredUsers);

    this.setState({
      users: filteredUsers,
      newUser: '',
    });
  };

  handleUser = user => {
    const {navigation} = this.props;

    navigation.navigate('User', {user});
  };

  render() {
    const {users, newUser, loading} = this.state;
    return (
      <Container>
        <Form>
          <Input
            onChangeText={text => {
              this.setState({newUser: text});
            }}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar Usuário"
            value={newUser}
            returnKeyType="send"
            onSubmitEditing={this.addUser}
          />
          <SubmitButton laoding={loading} onPress={this.addUser}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="add" size={20} color="#fff" />
            )}
          </SubmitButton>
        </Form>

        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({item}) => (
            <User>
              <RemoveButton onPress={() => this.removeUser(item.name)}>
                <Icon name="clear" size={18} color="red" />
              </RemoveButton>
              <Avatar source={{uri: item.avatar}} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>

              <ProfileButton
                onPress={() => {
                  this.handleUser(item);
                }}>
                <ProfileButtonText>Ver perfil</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    );
  }
}
