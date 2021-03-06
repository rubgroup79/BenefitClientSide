import React, { Component, } from 'react';
import { View, ScrollView, StyleSheet, Image, ListView, Dimensions, KeyboardAvoidingView, TextInput, AsyncStorage } from 'react-native';
import { Font } from 'expo';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import CreateNewTrainingModal from '../Components/CreateNewTrainingModal';
import {
    Text,
    Card,
    Tile,
    ListItem,
    Avatar,

    Button
} from 'react-native-elements';
import colors from '../config/colors';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class Chat extends Component {
    constructor() {
        super();
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });

        this.state = {
            selectedIndex: 0,
            value: 0.5,
            messages: [],
            fontLoaded: false,
            newMessage: "",
            sendButtonDisabled: true,
            newTrainingButtonDisabled: true,
            suggestionCode: 0,
            createNewTrainingModalVisible: false,
            chatCode: 0,
            status: 0,
            receiverToken: '',
            userFirstName: ''

        };

        this.newTrainingButtonDisabled = this.newTrainingButtonDisabled.bind(this);
        this.createNewTrainingModalVisible = this.createNewTrainingModalVisible.bind(this);
        this.updateIndex = this.updateIndex.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.getMessages = this.getMessages.bind(this);
        this.openChat = this.openChat.bind(this);
        this.getToken = this.getToken.bind(this);
        this.getLocalStorage = this.getLocalStorage.bind(this);
    }


    getLocalStorage = async () => {


        await AsyncStorage.getItem('Details', (err, result) => {
            if (result != null) {
                this.setState({ userFirstName: JSON.parse(result) });
            }
            else alert('error local storage is trainer');
        }
        )
    }


    async componentDidMount() {

        await Font.loadAsync({
            georgia: require('../../assets/fonts/Georgia.ttf'),
            regular: require('../../assets/fonts/Montserrat-Regular.ttf'),
            light: require('../../assets/fonts/Montserrat-Light.ttf'),
            bold: require('../../assets/fonts/Montserrat-Bold.ttf'),
        });

        this.setState({
            fontLoaded: true,

        });


    }
    getToken() {
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetToken?UserCode=' + this.props.navigation.getParam('PartnerUserCode', null), {
            method: 'GET',
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })
            .then(res => res.json())
            .then(response => {
                this.setState({ receiverToken: response })
            })
            .catch(error => console.warn('Error:', error.message));
    }


    async UNSAFE_componentWillMount() {
        this.getLocalStorage();
        this.checkForActiveSuggestion();
        this.openChat();
        this.getToken();
        renderMessages = setInterval(this.getMessages, 1000);
    }


    sendPushNotification(title, body) {

        console.warn(title);
        var pnd = {
            to: this.state.receiverToken,
            title: 'You Have a New Message From ' + title,
            body: body,
            badge: 1
        }
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/sendpushnotification', {
            body: JSON.stringify(pnd),
            method: 'POST',
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })
            .then(response => {
            })
            .catch(error => console.warn('Error:', error.message));
    }

    openChat() {

        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/OpenChat?UserCode1=' + this.props.navigation.getParam('UserCode', null) + "&UserCode2=" + this.props.navigation.getParam('PartnerUserCode', null), {
            method: 'POST',
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })
            .then(res => res.json())
            .then(response => {
                this.setState({ chatCode: response }, this.getMessages());
            })
            .catch(error => console.warn('Error:', error.message));
    }

    getMessages() {
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetMessages?ChatCode=' + this.state.chatCode, {
            method: 'GET',
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })
            .then(res => res.json())
            .then(response => {
                this.setState({ messages: response, status: 1 });
            })
            .catch(error => console.warn('Error:', error.message));
    }

    checkForActiveSuggestion() {
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetSuggestionCode?UserCode1=' + this.props.navigation.getParam('UserCode', null) + '&UserCode2=' + this.props.navigation.getParam('PartnerUserCode', null), {
            method: 'GET',
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })
            .then(res => res.json())
            .then(response => {
                if (response != 0) {
                    this.setState({ newTrainingButtonDisabled: false, suggestionCode: response });
                }

            })
            .catch(error => console.warn('Error:', error.message));
    }

    updateIndex(selectedIndex) {
        this.setState({ selectedIndex });
    }

    renderRow(rowData, sectionID) {
        return (
            <ListItem
                key={sectionID}
                onPress={log}
                title={rowData.title}
                leftIcon={{ name: rowData.icon }}
                chevron
                bottomDivider
            />
        );
    }

    renderSentMessages(content, sendingTime) {
        return (
            <View style={styles.sentMessages}>
                <Text style={{ flex: 1 }}>{content}</Text>
            </View>
        )
    }

    renderReceivedMessages(content, sendingTime) {
        return (
            <View>
                <View
                    style={styles.receivedMessages}
                    onPress={() => this.setState({ DateVisible: !this.state.DateVisible })}
                >

                    <Text style={{ flex: 1 }}>{content}</Text>
                </View>
            </View>
        )

    }

    sendMessage() {
        this.ScrollView.scrollToEnd();

        var message = {
            ChatCode: this.state.chatCode,
            SenderCode: this.props.navigation.getParam('UserCode', null),
            Content: this.state.newMessage
        }

        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/SendMessage', {
            method: 'POST',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify(message)
        })
            .then(() => {
                this.getMessages();
                this.sendPushNotification(this.state.userFirstName, this.state.newMessage)
            })
            .catch(error => console.warn('Error:', error.message));

        this.setState({ newMessage: '', sendButtonDisabled: true })
    }


    createNewTrainingModalVisible(intervalOff) {
        this.setState({ createNewTrainingModalVisible: !this.state.createNewTrainingModalVisible });
        if (intervalOff) {
            clearInterval(renderMessages);
        }
        else renderMessages = setInterval(this.getMessages, 3000);
    }

    newTrainingButtonDisabled() {
        this.setState({ newTrainingButtonDisabled: true })
    }


    render() {
        const { goBack } = this.props.navigation;
        return (
            <View>

                {this.state.fontLoaded ?

                    <View style={styles.container}>
                        {this.state.createNewTrainingModalVisible ?

                            <View style={styles.trainingModal}>
                                <CreateNewTrainingModal newTrainingButtonDisabled={this.newTrainingButtonDisabled} SuggestionCode={this.state.suggestionCode} WithTrainer={0} createNewTrainingModalVisible={this.createNewTrainingModalVisible}></CreateNewTrainingModal>
                            </View>
                            : null}



                        <View style={styles.headerContainer}>
                            <View style={{ flex: 1 }}>
                                <Button
                                    icon={() =>
                                        <Icon name='left' size={20} />}
                                    style={styles.backButtonConatiner}
                                    buttonStyle={styles.backButton}
                                    onPress={() =>
                                        goBack()
                                    }
                                    activeOpacity={0.5}
                                />
                            </View>
                            <View style={styles.partnerImageContainer}>
                                <Image style={styles.partnerImage} source={{ uri: this.props.navigation.getParam('Picture', null) }} />
                                <Text style={styles.heading}>{this.props.navigation.getParam('FullName', null)}</Text>
                            </View>
                            <Button
                                disabled={this.state.newTrainingButtonDisabled}
                                icon={() => <Icon2
                                    name='calendar-plus-o'
                                    size={25}
                                    color={'white'}

                                    style={styles.newTrainingIcon}
                                />}
                                style={styles.newTrainingContainer}
                                buttonStyle={styles.newTrainingButton}
                                onPress={() => this.createNewTrainingModalVisible(true)}
                                activeOpacity={0.5}
                            />
                        </View>
                        {this.state.status == 1 ?
                            <KeyboardAvoidingView
                                behavior="position"
                            >
                                <View style={{ height: SCREEN_HEIGHT - 80 }}>
                                    <ScrollView style={styles.scrollView}
                                        ref={(ref) => { this.ScrollView = ref }}
                                        onContentSizeChange={() => this.ScrollView.scrollToEnd({ animated: true })}
                                    >


                                        {this.state.messages.map((msg) => {
                                            return (<View key={msg.MessageCode}>
                                                {msg.SenderCode == this.props.navigation.getParam('UserCode') ? this.renderSentMessages(msg.Content, msg.SendingTime) : this.renderReceivedMessages(msg.Content, msg.SendingTime)}

                                            </View>)
                                        })}
                                    </ScrollView>
                                    <View style={styles.textInputContainer}>
                                        <TextInput
                                            value={this.state.newMessage}
                                            placeholder="Type here"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            ref={input => (this.usernameInput = input)}
                                            onChangeText={(Message) => {
                                                this.setState({ newMessage: Message });
                                                { Message == "" ? this.setState({ sendButtonDisabled: true }) : this.setState({ sendButtonDisabled: false }) }
                                            }}
                                            style={styles.textInput}
                                            multiline={true}
                                            scrollEnabled={true}

                                        />

                                        <Button
                                            disabled={this.state.sendButtonDisabled}
                                            icon={() => <Icon1
                                                name='md-send'
                                                size={25}
                                                color={'white'}
                                                style={styles.sendMessageIcon}
                                            />}
                                            style={styles.sendMessageContainer}
                                            buttonStyle={styles.sendMessageButton}
                                            onPress={() => this.sendMessage()}
                                            activeOpacity={0.5}
                                        />
                                    </View>

                                </View>
                            </KeyboardAvoidingView> : null}


                    </View> : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    scrollView:
    {
        position: 'absolute',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT - 150,
        zIndex: 0
    },
    textInputContainer:
    {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
    },
    textInput:
    {
        flex: 1,
        fontSize: 20,
        borderWidth: 1,
        borderColor: '#e2e2e2',
        borderRadius: 20,
        flex: 1,
        margin: 8,
        maxHeight: 150,
        padding: 8
    },
    sentMessages:
    {
        flex: 1,
        borderRadius: 20,
        backgroundColor: '#cbf2cd',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        width: 200,
        marginLeft: 20,
        marginTop: 10
    },
    receivedMessages:
    {
        flex: 1,
        borderRadius: 20,
        backgroundColor: '#dbd9d9',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginLeft: SCREEN_WIDTH - 220,
        width: 200,
        marginTop: 10
    },
    container:
    {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        position: 'absolute'
    },
    trainingModal:
    {
        flex: 1,
        zIndex: 2,
        width: SCREEN_WIDTH,
        backgroundColor: 'transparent',
        height: SCREEN_HEIGHT,
        alignItems: 'center',
        position: 'absolute'
    },
    newTrainingIcon:
        { alignItems: 'center', marginLeft: 2, marginBottom: 1 },
    newTrainingContainer:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8

    },
    newTrainingButton: {
        height: 45,
        width: 45,
        borderRadius: 30,
        backgroundColor: '#f34573',


    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: '#f5f5f5',
        height: 60,
        zIndex: 1,
    },
    backButtonContainer:
    {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
        marginLeft: 10

    },
    backButton:
    {
        height: 45,
        width: 45,
        borderRadius: 30,
        backgroundColor: 'transparent',
    },
    heading: {
        color: 'black',
        marginTop: 10,
        fontSize: 15,
        flex: 1,
        textAlign: 'center',
        fontFamily: 'bold',
        marginLeft: -80
    },
    partnerImageContainer:
    {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'flex-end',
    },
    partnerImage:
    {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    sendMessageIcon:
    {
        alignItems: 'center',
        marginLeft: 4
    },
    sendMessageContainer:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8

    },
    sendMessageButton:
    {
        height: 45,
        width: 45,
        borderRadius: 30,

    },
});

export default Chat;
