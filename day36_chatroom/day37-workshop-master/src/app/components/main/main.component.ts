import { Component, OnInit } from '@angular/core';
import  { ChatService } from '../../chat.service';
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  username: string;
  groups: any;
  
  mainForm = new FormGroup({
    username: new FormControl("", Validators.required),
  });
  
  constructor(private chatSvc: ChatService, 
    private router: Router,
    private storage: LocalStorage) {
      this.chatSvc.initSocket();
  }

  ngOnInit() {
    this.chatSvc.getAllGroup().then((result)=>{
      this.groups = result;
    })
  }

  navigateToChat(g){
    console.log("navigate >");
    console.log(g);
    this.username = this.mainForm.get("username").value;
    console.log(this.username);
    this.chatSvc.sendMessage({
      type: 'join',
      username: this.username,
      groupName: g
    })
    this.storage.setItem("username", this.username).subscribe(() => {});
    this.storage.setItem("groupName", g).subscribe(() => {});
    
    let link = ['/chat', g, this.username];
    this.router.navigate(link);
  }

}
