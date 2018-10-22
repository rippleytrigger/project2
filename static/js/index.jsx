// with ES6 import
import io from 'socket.io-client';
import { Template } from '../js/template';
import moment from 'moment'


/*function getStartingChannel(socketio)
{
    // This function only applies when the user selects a channel and then closes the window
    let startingPoint = localStorage.getItem('channel_url') != null ? localStorage.getItem('channel_url') : false; 

    if(startingPoint == false)
    {
        return false
    }
        
    //History Push State
    history.pushState(null, '', '/messages'+ startingPoint );

    // Get socketio class to emit an event
    socketio.emit('get channel chat', {'channel_url': startingPoint});
}*/

document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    let socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {

        //getStartingChannel(socket);

        // Display Create Channel form 
        document.querySelectorAll('.add-plus').forEach(element => {
            element.onclick = () => {
                document.querySelector('.create-channel-block').classList.add('active')
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

                //Store the channel url on localstorage
                localStorage.setItem('channel_url', url);
                
                //History Push State
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

        if (localStorage.getItem('channel_url') != null)
        {
            let message = event.target.querySelector('#chat-msg').value;
            let timestamp = moment().format('h:mm:ss A')
        
            socket.emit('set channel msg', {'channel_url': localStorage.getItem('channel_url') ,'message': message, 'timestamp': timestamp });
            
            event.target.reset()
        }
        else
        {
            console.error('You have to do click to a room in order to send messages')
        }

    })

    document.querySelector('.create-channel-block form').addEventListener('submit', (event) => {


        event.preventDefault();

        let channel = event.target.querySelector('#channel-name-input').value;
    
        socket.emit('set channel list', {'channel_url': `/${channel}` ,'channel_name': channel });
        
        document.querySelector('.create-channel-block').classList.remove('active')

        event.target.reset()

    })

});


document.querySelector('.close').addEventListener( 'click', () => {
    document.querySelector('.create-channel-block').classList.remove('active')
})

window.addEventListener("close", function( event ) {
    // make the close button ineffective
    event.preventDefault();
  }, false);