import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { ChatComponent } from './chat/chat.component';
import { HeaderComponent } from './chat/header/header.component';
import { MessageComponent } from './chat/message/message.component';
import { ChannelsComponent } from './list/channels/channels.component';
import { PrivateRoomsComponent } from './list/private-rooms/private-rooms.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    ChatComponent,
    HeaderComponent,
    MessageComponent,
    ChannelsComponent,
    PrivateRoomsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
