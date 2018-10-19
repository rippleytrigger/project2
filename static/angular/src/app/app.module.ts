import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { ChannelsComponent } from './list/channels/channels.component';
import { PrivateRoomsComponent } from './list/private-rooms/private-rooms.component';
import { ChatComponent } from './chat/chat.component';
import { MessageComponent } from './chat/message/message.component';
import { HeaderComponent } from './chat/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    ChannelsComponent,
    PrivateRoomsComponent,
    ChatComponent,
    MessageComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
