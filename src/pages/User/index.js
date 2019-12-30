import React, {Component} from 'react';
import api from '../../services/api';
import PropTypes from 'prop-types';
import {
  Container,
  Avatar,
  Name,
  Bio,
  Header,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    page: 2,
    refreshing: false,
    loading: true,
  };

  async componentDidMount() {
    this.load();
  }

  load = async (page = 1) => {
    const {stars} = this.state;
    const {navigation} = this.props;
    const user = navigation.getParam('user');
    const response = await api.get(`/users/${user.login}/starred`, {
      params: {page},
    });

    this.setState({
      page,
      stars: page >= 2 ? [...stars, ...response.data] : response.data,
      refreshing: false,
      loading: false,
    });
  };

  loadMore = async () => {
    const {page} = this.state;

    const nextPage = page + 1;

    this.load(nextPage);
  };

  refreshList = async () => {
    this.setState(
      {
        refreshing: true,
        stars: [],
      },
      this.load,
    );
  };

  handleNavigate = repository => {
    const {navigation} = this.props;

    navigation.navigate('Repository', {repository});
    console.tron.log('Navigate');
  };

  render() {
    const {navigation} = this.props;
    const {stars, refreshing, loading} = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{uri: user.avatar}} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <Loading />
        ) : (
          <Stars
            onRefresh={this.refreshList}
            refreshing={refreshing}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({item}) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{uri: item.owner.avatar_url}} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
