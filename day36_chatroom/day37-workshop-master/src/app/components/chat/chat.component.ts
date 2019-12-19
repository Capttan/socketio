import { Component, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { ChatService } from '../../chat.service';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  groupName: string;
  username: string;
  chats: any;
  messageData: string;
  
  topHeight : string = '85px';
  maxHeight: string = "600px";
  isContentLoader: boolean = true;
  public disabled: boolean = false;
  public type: string = 'component';
  public config: PerfectScrollbarConfigInterface = {suppressScrollY: false, suppressScrollX: true, 
    wheelPropagation: false};
  
  @ViewChild(PerfectScrollbarComponent, { static: true }) componentRef?: PerfectScrollbarComponent;
  @ViewChild('chatPS', { static: false }) chatPS?: PerfectScrollbarComponent;
  @Output() nameEvent = new EventEmitter<string>();
  ioConnection: any;
  
  chatForm = new FormGroup({
    message: new FormControl("", Validators.required),
  });

  constructor(private activatedRoute: ActivatedRoute,
    private chatSvc: ChatService,
    private storage: LocalStorage) { }

  ngOnInit() {
    this.groupName = this.activatedRoute.snapshot.params.groupName;
    this.username = this.activatedRoute.snapshot.params.name;
    console.log(this.groupName);
    this.ioConnection = this.chatSvc.onMessage()
      .subscribe((message: any) => {
        console.log("message receive on ag" + message);
        this.chats = message;
    });
  }

  scrollBottom(){
    this.chatPS.directiveRef.scrollToBottom();
  }

  onScrollEvent(event){}
  
  sendMessage(){
    this.messageData = this.chatForm.get("message").value;
    this.storage.getItem('username').subscribe((username) => {
      this.storage.getItem('groupName').subscribe((groupName) => {
        console.log(username);
        console.log(groupName);
        this.chatSvc.sendMessage({
          type: 'message',
          username: username,
          groupName: groupName,
          data: this.messageData
        });
        this.chatForm.patchValue({
          message: ''
        });
      });
    });
  }
 
}
