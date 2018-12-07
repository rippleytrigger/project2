// with ES6 import
import io from 'socket.io-client';
import moment from 'moment'


class Channel{

    constructor(template) {
        this.socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
        this.socket.channel = this;

        this.template = template

        this.EventsHandler()
    }

    EventsHandler() {
        document.addEventListener('DOMContentLoaded', () =>  {

            this.socket.on("get user room", (channel) => {
                this.GetUserInitialChannelRoom(channel)
            })

            this.socket.on("clean user channel localStorage", (channel) => {
                this.CleanUserChannelLocalStorage(channel)
            })

            this.socket.on('show channel list', (data) => {
                this.socket.channel.ShowChannelList(data)
            })
            this.socket.on('show channel chat', this.ShowChannelChat)
            this.socket.on('show error in chat', this.ShowErrorInChat)

            document.querySelector('.msg-block form').addEventListener('submit', this.SetChannelMsg.bind(this))
            document.querySelector('.create-channel-block form').addEventListener('submit', this.CreateChannelRoom.bind(this))
            document.querySelector('.create-private-room-block form').addEventListener('submit', this.GetUserToChat.bind(this))
        })
    }

    CreateChannelRoom(event) {

        event.preventDefault();

        let channel = event.target.querySelector('#channel-name-input').value;
    
        this.socket.emit('set channel list', {'channel_url': `/${channel}` ,'channel_name': channel });
        
        document.querySelector('.create-channel-block').classList.remove('active')

        event.target.reset()
    }

    GetUserToChat(event) {
        event.preventDefault();
    }

    SetChannelMsg(event) {

        event.preventDefault();

        if (localStorage.getItem('channel_url') != null)
        {
            let message = event.target.querySelector('#chat-msg').value;
            let timestamp = moment().format('h:mm:ss A')
        
            this.socket.emit('set channel msg', {'channel_url': localStorage.getItem('channel_url') ,'message': message, 'timestamp': timestamp });
            
            event.target.reset()
        }
        else
        {
            console.error('You have to do click to a room in order to send messages')
        }
    }
    
    ShowChannelList(data) {

        this.template.listTemplate(data)

        let channel_list = document.querySelectorAll('.rooms-url');
        
        channel_list.forEach(element => {    
            element.addEventListener('click', this.socket.channel.JoinChannelRoom.bind(this))
        })
    }

    // Clean it only if the user does not have any selected channel
    CleanUserChannelLocalStorage()
    {
        localStorage.clear()
    }

    GetUserInitialChannelRoom(channel)
    {
        localStorage.clear()

        //Store the channel url on localstorage
        localStorage.setItem('channel_name', channel);
        localStorage.setItem('channel_url', "/"+ channel);
        
        //History Push State
        history.pushState(null, '', '/messages/' + channel);

        this.socket.emit('join', {'channel_url': "/" + channel, 'channel_name': channel});
    }

    JoinChannelRoom(event) {

        event.preventDefault()

        const url = event.target.dataset.url;
        const channel = event.target.dataset.channel;

        //Store the channel url on localstorage
        localStorage.setItem('channel_name', channel);
        localStorage.setItem('channel_url', url);
        
        //History Push State
        history.pushState(null, '', '/messages'+ event.target.dataset.url );

        this.socket.emit('join', {'channel_url': url, 'channel_name': channel});
    }

    ShowChannelChat(data) {
        this.channel.template.msgTemplate(data) 
    }

    ShowErrorInChat(data) {
        this.channel.template.errorChatTemplate(data)
    }
}

export default Channel;