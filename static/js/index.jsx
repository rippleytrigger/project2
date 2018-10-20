// with ES6 import
import io from 'socket.io-client';
import { Template } from '../js/template';
import moment from 'moment'

document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    let socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {

        document.querySelectorAll('.add-plus').forEach(element => {
            element.onclick = () => {
                const channel = 'Epale';
                const url = '/epale'
                socket.emit('set channel list', {'channel_name': channel, 'channel_url': url});
            };
        });
    });

    socket.on('show channel list', (data) => {
        Template.listTemplate(data)

        let channel_list = document.querySelectorAll('.rooms-url');
        
        channel_list.forEach(element => {    

            element.onclick = (event) => {

                event.preventDefault()

                const url = element.dataset.url;

                history.pushState(null, '', '/messages'+ element.dataset.url );

                socket.emit('get channel chat', {'channel_url': url});
            }
        })
    })

    socket.on('show channel chat', (data) => {
        Template.msgTemplate(data) 
    })

    document.querySelector('.msg-block form').addEventListener('submit', (event) => {

        event.preventDefault();

        let message = event.target.querySelector('#chat-msg').value;
        let timestamp = moment().format('h:mm:ss A')
    
        socket.emit('set channel msg', {'channel_url': '/epale' ,'message': message, 'timestamp': timestamp });
        
        event.target.reset()
    })

});





