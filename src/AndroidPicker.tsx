import React from 'react';
import { View, Animated, Text, StyleSheet, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Touchable from '@appandflow/touchable';
import pickerStore, { ANIMATION_DURATION, Item } from './PickerStore';

const ANDROID_SECONDARY_VARIANT = '#018786';

interface P {
  onChange: any;
  getRef: (androidPicker: AndroidPicker) => void;
  date: Date;
  item: Item;
  onCancel: () => void;
}

export default class AndroidPicker extends React.Component<P> {
  state = {
    isOpen: true,
    opacity: new Animated.Value(0),
    windowOpacity: new Animated.Value(0),
    date: new Date(),
    item: null,
  };

  componentDidMount() {
    this.props.getRef(this);
    this.setState({ date: this.props.date, item: this.props.item });
  }

  _animateOpen = () => {
    Animated.timing(this.state.opacity, {
      toValue: 0.4,
      duration: ANIMATION_DURATION,
      useNativeDriver: pickerStore.pickerOptions.useNativeDriver || false,
    }).start();
    Animated.timing(this.state.windowOpacity, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      useNativeDriver: pickerStore.pickerOptions.useNativeDriver || false,
    }).start();
  };

  _animateClose = () => {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: pickerStore.pickerOptions.useNativeDriver || false,
    }).start();
    Animated.timing(this.state.windowOpacity, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: pickerStore.pickerOptions.useNativeDriver || false,
    }).start();
  };

  render() {
    const { pickerOptions } = pickerStore;

    const doneButtonText = pickerOptions.doneButtonText || 'Ok';
    const cancelButtonText = pickerOptions.cancelButtonText || 'Cancel';

    if (!this.state.isOpen) {
      return null;
    }

    return pickerOptions.pickerType === 'normal' ? (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: '10%',
          ...StyleSheet.absoluteFillObject,
        }}
      >
        <Touchable
          feedback="none"
          native={false}
          style={{
            flex: 1,
            ...StyleSheet.absoluteFillObject,
          }}
          onPress={pickerOptions.onTapOut || this.props.onCancel}
        >
          <Animated.View
            style={[
              {
                opacity: this.state.opacity,
                flex: 1,
                backgroundColor: 'black',
              },
            ]}
          />
        </Touchable>
        <Animated.View
          style={[
            {
              backgroundColor: 'rgb(250,250,250)',
              minHeight: Math.min(pickerOptions.items ? pickerOptions.items.length * 78 : 0, 270),
              width: '100%',
              borderRadius: 3,
              opacity: this.state.windowOpacity,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            },
            pickerOptions.androidModalStyle
              ? pickerOptions.androidModalStyle
              : {},
          ]}
        >
          <FlatList
            data={pickerOptions.items || []}
            style={{ flex: 1 }}
            renderItem={({ item }) => (
              <RowItem
                style={pickerOptions.androidItemStyle}
                textStyle={pickerOptions.androidItemTextStyle}
                selectedStyle={pickerOptions.androidSelectedItemStyle}
                selectedTextStyle={pickerOptions.androidSelectedItemTextStyle}
                onPress={() => this.setState({ item })}
                label={item.label}
                selected={
                  // @ts-ignore
                  this.state.item ? item.value === this.state.item.value : false
                }
              />
            )}
            keyExtractor={item => String(item.value)}
          />
          <View style={{ alignSelf: 'flex-end', flexDirection: 'row', paddingRight: 20, paddingBottom: 10 }}>
            <AndroidButtonText
              text={cancelButtonText}
              onPress={pickerOptions.onTapOut || this.props.onCancel}
              textStyle={pickerOptions.doneButtonTextStyle}
            />
            <AndroidButtonText
              text={doneButtonText}
              onPress={() => this.props.onChange(this.state.item)}
              textStyle={pickerOptions.doneButtonTextStyle}
            />
          </View>
        </Animated.View>
      </View>
    ) : (
      <DateTimePicker
        value={this.state.date}
        // @ts-ignore
        mode={pickerOptions.mode || 'time'}
        onChange={(_, date) => {
          this.setState({ isOpen: false }, () => this.props.onChange(date));
        }}
        maximumDate={pickerOptions.maximumDate}
        minimumDate={pickerOptions.minimumDate}
        timeZoneOffsetInMinutes={pickerOptions.timeZoneOffsetInMinutes}
        locale={pickerOptions.locale}
        // @ts-ignore
        is24Hour={pickerOptions.is24Hour}
        minuteInterval={pickerOptions.minuteInterval}
      />
    );
  }
}

const AndroidButtonText = ({
  text,
  onPress,
  textStyle,
  containerStyle,
}: {
  text: string;
  onPress: any;
  textStyle?: any;
  containerStyle?: any;
}) => (
  <Touchable
    feedback="opacity"
    native={false}
    onPress={onPress}
    hitslop={{ top: 20, left: 20, right: 20, bottom: 20 }}
    style={[{
      paddingHorizontal: 10,
      paddingVertical: 10,
      minWidth: 60,
    }, containerStyle]}
  >
    <Text
      style={[
        {
          color: ANDROID_SECONDARY_VARIANT,
          fontSize: 15,
          fontWeight: '400',
          textTransform: 'uppercase',
          textAlign: 'center'
        },
        textStyle,
      ]}
    >
      {text}
    </Text>
  </Touchable>
);

const RowItem = ({
  label,
  selected,
  onPress,
  style = {},
  textStyle = {},
  selectedStyle = {},
  selectedTextStyle = {}
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
  style?: any;
  textStyle?: any;
  selectedStyle?: any;
  selectedTextStyle?: any;
}) => (
  <AndroidButtonText
    text={label}
    textStyle={[{
      color: selected ? ANDROID_SECONDARY_VARIANT : '#616161',
      fontSize: 17,
      fontWeight: '400',
      textAlign: 'left',
      textTransform: 'none',
      ...textStyle,
    }, selected && selectedTextStyle]}
    onPress={onPress}
    containerStyle={
      selected
        ? {
            justifyContent: 'center',
            paddingHorizontal: 20,
            minWidth: 40,
            ...style,
            ...selectedStyle,
          }
        : {
            justifyContent: 'center',
            paddingHorizontal: 20,
            minWidth: 40,
            ...style,
          }
    }
  />
);
