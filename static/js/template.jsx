class template
{
    listTemplate(content)
    {
        let channels = document.querySelector('.list-group');

        let template = '';

        for (let elem in content)
        {
            template += `<li class="list-group-item"><a href='' class='rooms-url' data-url='${content[elem]['channel_url']}'>${ content[elem]['channel_name']  }</a></li>`;
        }
        
        channels.innerHTML = template;
    }

    msgTemplate(content)
    {
        let channelChat = document.querySelector('.chat-block');

        let template = '';

        for (let msg of content.channel_msg)
        {
            console.log(msg)
            template += 
            `<div class="msg-element user-1">
                <small>${msg.username} ${msg.timestamp}</small>
                <p>
                    ${msg.message}
                </p>
            </div>`;
        }

        channelChat.innerHTML = template;
    }
}

const Template = new template();

export { Template };


