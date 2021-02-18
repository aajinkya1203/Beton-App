import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import ModalDropdown from 'react-native-modal-dropdown';
import { Block, Text } from 'galio-framework';

import Icon from './Icon';

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

class DropDown extends React.Component {
  state = {
    value: 1,
  }

  handleOnSelect = (index, value) => {
    const { onSelect } = this.props;

    this.setState({ value: value });
    onSelect && onSelect(index, value);
  }

  render() {
    const { onSelect, iconName, iconFamily, iconSize, iconColor, color, textStyle, style, ...props } = this.props;

    const modalStyles = [
      styles.qty,
      color && { backgroundColor: color },
      style
    ];

    const textStyles = [
      styles.text,
      textStyle
    ];

    return (
      <ModalDropdown
        style={modalStyles}
        onSelect={this.handleOnSelect}
        dropdownStyle={styles.dropdown}
        dropdownTextStyle={{paddingLeft:16, fontSize:12}}
        {...props}>
        <Block flex row middle space="between">
          <Text size={12} style={textStyles}>{this.state.value}</Text>
          <Icon name={iconName || "nav-down"} family={iconFamily || "ArgonExtra"} size={iconSize || 10} color={iconColor || argonTheme.COLORS.WHITE} />
        </Block>
      </ModalDropdown>
    )
  }
}

DropDown.propTypes = {
  onSelect: PropTypes.func,
  iconName: PropTypes.string,
  iconFamily: PropTypes.string,
  iconSize: PropTypes.number,
  color: PropTypes.string,
  textStyle: PropTypes.any,
};

const styles = StyleSheet.create({
  qty: {
    width: 100,
    backgroundColor: argonTheme.COLORS.DEFAULT,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom:9.5,
    borderRadius: 4,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
  },
  text: {
    color: argonTheme.COLORS.WHITE,
    fontWeight: '600'
  },
  dropdown: {
    marginTop: 8,
    marginLeft: -16,
    width: 100,
  },
});

export default DropDown;
