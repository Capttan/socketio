import { Component, OnInit} from '@angular/core';
import  { ChatService } from './chat.service';
import { Router } from "@angular/router";
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'day37-workshop';
  
  constructor(private chatSvc: ChatService,
    private router: Router,
    private storage: LocalStorage){}

  ngOnInit(){
    
  }

  leaveChat(){
    console.log("Leaving chat ...");
    this.storage.getItem('username').subscribe((username) => {
      this.storage.getItem('groupName').subscribe((groupName) => {
        console.log(username);
        console.log(groupName);
        
        this.chatSvc.sendMessage({
          type: 'leave',
          username: username,
          groupName: groupName
        });
        this.chatSvc.disconnect();
        this.router.navigate(['/']);
      });
    });
  }
}
