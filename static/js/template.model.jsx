class Template
{
    constructor() {
        this.eventsHandler();
    }

    eventsHandler() 
    {
        document.addEventListener('DOMContentLoaded', () => {

            document.querySelectorAll('.add-plus').forEach( element => 
            {
                element.addEventListener( "click", this.getCreateChannelBlock);
            })

            document.querySelector('.create-channel-block .close').addEventListener("click", this.removeCreateChannelBlock);
        })
    }

    listTemplate(content)
    {
        let channels = document.querySelector('.list-group');

        let template = '';

        for (let elem in content)
        {
            template += `<li class="list-group-item"><a href='' class='rooms-url'  data-channel='${content[elem]['channel_name']}' \
            data-url='${content[elem]['channel_url']}'>${ content[elem]['channel_name']  }</a></li>`;
        }
        
        channels.innerHTML = template;
    }

    msgTemplate(content)
    {
        let channelChat = document.querySelector('.chat-block');

        let template = '';

        for (let msg of content.channel_msg)
        {
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

    errorChatTemplate(content)
    {
        let channelChat = document.querySelector('.chat-block');

        let template = '';
        

        template += 
        `<div class="msg-element error-msg">
            <p>
                    ${content.message}
            </p>
        </div>`;

        channelChat.innerHTML = template;
    }

    removeCreateChannelBlock()
    {
        document.querySelector('.create-channel-block').classList.remove('active')
    }

    getCreateChannelBlock() 
    {
        document.querySelector('.create-channel-block').classList.add('active')
    }
}

export default Template;


