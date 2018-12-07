class Template
{
    constructor() {
        this.eventsHandler();
    }

    eventsHandler() 
    {
        document.addEventListener('DOMContentLoaded', () => {

            document.querySelectorAll('.add-plus')[0].addEventListener( "click", this.getCreateChannelBlock);

            document.querySelectorAll('.add-plus')[1].addEventListener( "click", this.getUsernameChatBlock);

            document.querySelector('.create-channel-block .close').addEventListener("click", this.removeCreateChannelBlock);

            document.querySelector('.create-private-room-block .close').addEventListener("click", this.removeUsernameChatBlock);

            document.querySelector('.file-upload').addEventListener('click', () => { document.querySelector('.file-upload-block').classList.add('active') })
            document.querySelector('.file-upload-block .close').addEventListener('click', () => { document.querySelector('.file-upload-block').classList.remove('active') })
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

    getUsernameChatBlock() 
    {
        document.querySelector('.create-private-room-block').classList.add('active')

        fetch("http://127.0.0.1:5000/users").then(function(data)
        {
            console.log(data)
        })
        .then( data =>
        {
            console.log(data)
        })
    }

    removeUsernameChatBlock()
    {
        document.querySelector('.create-private-room-block').classList.remove('active')
    }
}

export default Template;


