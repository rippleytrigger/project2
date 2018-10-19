// with ES6 import
import io from 'socket.io-client';
import Handlebars from 'handlebars';

document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    let socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', (data) => {

        console.log(data)

        // Each button should emit a "submit vote" event
        document.querySelectorAll('.add-plus').forEach(element => {
            element.onclick = () => {
                console.log('Epale')
                const channel = 'Epale';
                socket.emit('channel list', {'channel-name': channel});
            };
        });
    });

    socket.on('show channel list', (data) => {

        for (let elem in data)
        {
            template = Handlebars.compile("<li class='list-group-item'> {{ elem }} </li>");
        }
            
        Handlebars.registerHelper('list', function(data) {

            let element = '';
          
            for(var i=0, j=context.length; i<j; i++) {
              ret = ret + options.fn(context[i]);
            }
          
            return ret;
        });
    })
});
