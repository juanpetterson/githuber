import React, { Component } from "react";
import PropTypes from "prop-types";
import api from "~/services/api";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  AsyncStorage,
  ActivityIndicator
} from "react-native";

import styles from "./styles";

export default class Welcome extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func
    }).isRequired
  };

  state = {
    username: "",
    loading: false,
    error: false
  };

  checkUserExists = async username => {
    const user = await api.get(`/users/${username}`);

    return user;
  };

  saveUser = async username => {
    await AsyncStorage.setItem("@Githuber:username", username);
  };

  signIn = async () => {
    const { username } = this.state;
    const { navigation } = this.props;

    this.setState({ loading: true });

    try {
      await this.checkUserExists(username);
      await this.saveUser(username);

      navigation.navigate("User");
    } catch (err) {
      this.setState({ loading: false, error: true });
    }
  };

  render() {
    const { username, loading, error } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.text}>
          To continue we need you to inform your user on Github.
        </Text>

        {error && <Text style={styles.error}>User not found.</Text>}

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Enter your username"
            underlineColorAndroid="transparent"
            value={username}
            onChangeText={text => this.setState({ username: text })}
          />

          <TouchableOpacity style={styles.button} onPress={this.signIn}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
