import React, { useContext } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { addBaseReport, addReport, decrypt, existingBaseCoordinate } from '../queries/query'

import { Button } from "../components";
import { Images } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { isRequiredArgument } from "graphql";
import { AuthContext } from '../auth/context'
import { flowRight as compose } from 'lodash';
import { graphql } from 'react-apollo'

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

const argonTheme = {
  COLORS: {
    DEFAULT: '#172B4D',
    PRIMARY: '#5E72E4',
    SECONDARY: '#F7FAFC',
    LABEL: '#FE2472',
    INFO: '#11CDEF',
    ERROR: '#F5365C',
    SUCCESS: '#2DCE89',
    WARNING: '#FB6340',
    /*not yet changed */
    MUTED: '#ADB5BD',
    INPUT: '#DCDCDC',
    INPUT_SUCCESS: '#7BDEB2',
    INPUT_ERROR: '#FCB3A4',
    ACTIVE: '#5E72E4', //same as primary
    BUTTON_COLOR: '#9C26B0', //wtf
    PLACEHOLDER: '#9FA5AA',
    SWITCH_ON: '#5E72E4',
    SWITCH_OFF: '#D4D9DD',
    GRADIENT_START: '#6B24AA',
    GRADIENT_END: '#AC2688',
    PRICE_COLOR: '#EAD5FB',
    BORDER_COLOR: '#E7E7E7',
    BLOCK: '#E7E7E7',
    ICON: '#172B4D',
    HEADER: '#525F7F',
    BORDER: '#CAD1D7',
    WHITE: '#FFFFFF',
    BLACK: '#000000'
  }
};

const Viewed = [
  'https://images.unsplash.com/photo-1501601983405-7c7cabaa1581?fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1543747579-795b9c2c3ada?fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1551798507-629020c81463?fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1503642551022-c011aafb3c88?fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1482686115713-0fbcaced6e28?fit=crop&w=240&q=80',
];

const Profile = (props) => {

  const { signOut } = useContext(AuthContext)

  console.log("Props in profile: ", props)

  return (
    <Block flex style={styles.profile}>
      <Block flex>
        <ImageBackground
          source={require('../imgs/profile-screen-bg.png')}
          style={styles.profileContainer}
          imageStyle={styles.profileBackground}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width, marginTop: '25%' }}
          >
            <Block flex style={styles.profileCard}>
              <Block middle style={styles.avatarContainer}>
                <Image
                  source={require('../imgs/prof.jpg')}
                  style={styles.avatar}
                />
              </Block>
              <Block style={styles.info}>
                <Block
                  middle
                  row
                  space="evenly"
                  style={{ marginTop: 20, paddingBottom: 24 }}
                >
                  <Button
                    small
                    style={{ backgroundColor: argonTheme.COLORS.INFO }}
                  >
                    Rewards
                    </Button>
                  <Button
                    onPress={() => signOut()}
                    small
                    style={{ backgroundColor: argonTheme.COLORS.DEFAULT }}
                  >
                    Log Out
                    </Button>
                </Block>
                <Block row space="between">
                  <Block middle>
                    {
                      props && props.decrypt && props.decrypt.loading == false && props.decrypt.decrypt ?
                        <Text
                          bold
                          size={18}
                          color="#ffffff"
                          style={{ marginBottom: 4, fontFamily: 'Lexand' }}
                        >
                          {props.decrypt.decrypt.reports.length}
                        </Text> : null
                    }
                    <Text size={12} color="#ffffff" style={{fontFamily: 'Lexand'}}>Reports</Text>
                  </Block>
                  <Block middle>
                    <Text
                      bold
                      color="#ffffff"
                      size={18}
                      style={{ marginBottom: 4, fontFamily: 'Lexand' }}
                    >
                      10
                      </Text>
                    <Text size={12} color="#ffffff" style={{fontFamily: 'Lexand'}}>Completed</Text>
                  </Block>
                  <Block middle>
                    <Text
                      bold
                      color="#ffffff"
                      size={18}
                      style={{ marginBottom: 4, fontFamily: 'Lexand' }}
                    >
                      89
                      </Text>
                    <Text size={12} color="#ffffff" style={{fontFamily: 'Lexand'}}>Rewards</Text>
                  </Block>
                </Block>
              </Block>
              <Block flex>
                <Block middle style={styles.nameInfo}>
                  {
                    props && props.decrypt && props.decrypt.loading == false && props.decrypt.decrypt ?
                      <Text bold size={28} color="#ffffff" style={{fontFamily: 'Lexand'}}>
                        {props.decrypt.decrypt.name}
                      </Text> : <Text bold size={28} color="#ffffff" style={{fontFamily: 'Lexand'}}>Loading...</Text>
                  }
                  {
                    props && props.decrypt && props.decrypt.loading == false && props.decrypt.decrypt ?
                      <Text size={16} color="#ffffff" style={{ marginTop: 10 }}>
                        {
                          props.decrypt.decrypt.karma < 25 ?
                            <Text size={16} color="#ffffff" style={{ marginTop: 10 }}>Beginner</Text> :
                            props.decrypt.decrypt.karma < 65 ?
                              <Text size={16} color="#ffffff" style={{ marginTop: 10 }}>Intermediate</Text> :
                              <Text size={16} color="#ffffff" style={{ marginTop: 10 }}>Pro</Text>
                        }
                      </Text> : <Text size={16} color="#ffffff" style={{ marginTop: 10 }}>Loading...</Text>
                  }
                </Block>
                <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                  <Block style={styles.divider} />
                </Block>
                {/*<Block middle>
                    <Text
                      size={16}
                      color="#525F7F"
                      style={{ textAlign: "center" }}
                    >
                      An artist of considerable range, Jessica name taken by
                      Melbourne …
                    </Text>
                    <Button
                      color="transparent"
                      textStyle={{
                        color: "#233DD2",
                        fontWeight: "500",
                        fontSize: 16
                      }}
                    >
                      Show more
                    </Button>
                    </Block>*/}
                <Block
                  row
                  space="between"
                >
                  {/*<Text bold size={16} color="#525F7F" style={{ marginTop: 12 }}>
                    Album
                    </Text>
                  <Button
                    small
                    color="transparent"
                    textStyle={{ color: "#5E72E4", fontSize: 12, marginLeft: 24 }}
                  >
                    View all
                  </Button>*/}
                </Block>
                <Block style={{ paddingBottom: -HeaderHeight * 2 }}>
                  {/*<Block row space="between" style={{ flexWrap: "wrap" }}>
                    {Viewed.map((img, imgIndex) => (
                      <Image
                        source={{ uri: img }}
                        key={`viewed-${img}`}
                        resizeMode="cover"
                        style={styles.thumb}
                      />
                    ))}
                    </Block>*/}
                </Block>
              </Block>
            </Block>
          </ScrollView>
        </ImageBackground>
      </Block>
    </Block>
  );
}


const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1,
    backgroundColor: "#ffffff"
  },
  profileContainer: {
    width: width,
    height: height * 0.9,
    padding: 0,
    zIndex: 1,
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
    backgroundColor: "#212121"
  },
  info: {
    paddingHorizontal: 40
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0
  },
  nameInfo: {
    marginTop: 35
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF"
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  }
});

export default compose(
  graphql(decrypt, {
    name: "decrypt",
    options: () => {
      console.log("Global Tempo: ", global.tempo, typeof (global.tempo))
      return {
        variables: {
          token: global.tempo
        }
      }
    }
  })
)(Profile)
