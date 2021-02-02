import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../session.service';
import { DataService } from '../../data.service';
import { environment } from '../../../environments/environment';
import { Ng2ImgMaxService } from 'ng2-img-max';
import {formatDate} from '@angular/common';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import UIkit from 'uikit';
import { User } from '../../../models/User';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {
  
  sex: boolean = true;
  public avatarPic="assets/images/avatar.svg";
  // public userName="themis brink";
  public _name = "User #636";
  public _sex = "";
  public _age = 0;
  data$: User;
  private token;
  
  public showAvatar = true;
  selectedFile: any;
  
  constructor(private sessionService: SessionService, private dataService: DataService, private ng2ImgMax: Ng2ImgMaxService, private router: Router, private cookieService: CookieService) { }
  
  doAlert(){
      this.sex = !this.sex;
      console.log(this.sex); // black
    }
  
  OnFileSelected(event){
    console.log(event.target.files);
  
    // event.target.files
  
    if(event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      console.log(this.selectedFile);
      
        this.ng2ImgMax.resizeImage(this.selectedFile, 120, 120).subscribe(
        result => {
          this.selectedFile = result;
          let reader = new FileReader();
          reader.readAsDataURL(this.selectedFile);
          reader.onload = () => {
            const body = {
              filename: this.selectedFile.name,
              filetype: this.selectedFile.type,
              value: reader.result.split(',')[1]
            };
            
            this.dataService.saveUserProfile({
              picture: body
            }).then(
              (res: any) => { 
                if (this.sessionService.user)
                  this.sessionService.user.picture = res.picture;
                this.avatarPic =  environment.gameServerDomainUrl + '/' + res.picture+"?" + formatDate(new Date(), 'yyyy/MM/dd', 'en');
                this.refreshDiv();
              },
              err => { }
              );
    
          };
        },
        error => {
          console.log('😢 Oh no!', error);
        }
      );
      
      
    }
  }
  
  ngOnInit() {
    
    // document.cookie = "MTSWebSSO=AQIC5wM2LY4SfcyG6qac3fbx5zt3ahcEyy7DWu13-YAK7YU.*AAJTSQACMDQAAlNLABQtMzg3NzQ5NzM0NjgyODcyNTUyMgACUzEAAjI0*; expires=Thu, 18 Dec 2023 12:00:00 UTC"
    // document.cookie = "username=John Doe";  
     // user login validation check
    if (!this.sessionService.token || !this.sessionService.isSubscribed || !this.sessionService.isEligible) {
      // wanna inform the user here?
      //this._cashback = this.sessionService.cashback;
      // Initiate user authentication
      // this.dataService.authenticateRedirect();
    }
    else {
      this.token = this.sessionService.token;
      this.data$ = this.sessionService.user;
      // this._name =  "Paul Macartney"; //this.data$.username;
      // this._age = 22; //this.data$.age;
      // this._sex = "female"; //this.data$.gender;
    
      // this.data$ = this.sessionService.user;
      this.avatarPic =  environment.gameServerDomainUrl + '/' + this.data$.picture;
      this._name =  this.data$.username;
      this._age = this.data$.age;
      this._sex = this.data$.gender;

      this.sex = (this._sex === "male") ? this.sex = true : this.sex = false;
      
      if( this.data$.picture == null){
        this.avatarPic = "assets/images/avatar.svg";
        
      } else
        this.refreshDiv();
      // setTimeout(()=>{
      //   //alert(11)
      //     this.userImg = "https://raw.githubusercontent.com/HaithemMosbahi/ngx-avatar/master/demo/src/assets/img/avatar.jpg";
          
      //   }, 5000) 
    
    }
    
  }
  
   refreshDiv(){
    console.log("Refreshing Avatar!!!");
    this.showAvatar = false;
    this.avatarPic = "assets/images/avatar.svg";
    // setTimeout(()=>{
    //       this.avatarPic = "assets/images/avatar.svg";
    //       this.showAvatar = true
    //       // this.avatarPic =  environment.gameServerDomainUrl + '/' + this.data$.picture;
    //       }, 1000);
   setTimeout(()=>{
          
          this.showAvatar = true
          this.avatarPic =  environment.gameServerDomainUrl + '/' + this.data$.picture;
          console.log(this.avatarPic)!
          }, 1000);

  }
  
  saveData() {
    let modal = UIkit.modal("#error");
    this.dataService.saveUserProfile({
      username: this._name,
      gender: this.sex ? 'male' : 'female',
      age: this._age
    }).then(
      res => { modal.show(); },
      err => { }
      );
  }
  
  goProfile() {
    this.router.navigate(['/profile']);
  }
  
  goHome() {
    this.router.navigate(['home']);
  }
  
  logOut() {
    console.log("LoggingOut!");
    const allCookies: {} = this.cookieService.getAll();
    console.log(allCookies);
     
    // Trying the updated MTS logout redirect with the logout parameter
    this.sessionService.reset();
    this.router.navigate(['/home']);
    // this.dataService.logoutRedirect();
    
    // Trying the MTS revoke endpoint
    // this.dataService.logout().subscribe(
    //   (data: any) => {
    //     console.log(JSON.stringify(data));
    //     this.sessionService.reset();
    //     this.router.navigate(['/home']);
    //   },
    //   (error: any) => {
    //     console.error(error);
    //   }
    // )
     
     
     
     
     
     
    
    // for( var i = 0; i< allCookies.count; i++) {
    //   this.cookieService.delete(allCookies[i]);
    // }
    // this.cookieService.deleteAll('/');
     
    // // this.cookieService.deleteAll();
    
    
    // var cookies = document.cookie.split(";");

    //   for (var i = 0; i < cookies.length; i++) {
    //       var cookie = cookies[i];
    //       console.log(cookie);
    //       var eqPos = cookie.indexOf("=");
    //       var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    //       document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    //   }
      
    // document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
   
    // // window.open('https://login.mts.ru/amserver/UI/Logout', '_blank');
    // var tempUrl = 'https://login.mts.ru/amserver/oauth2/revoke?token='+this.token;
    // window.open(tempUrl);
    
    
    // this.dataService.logoutRedirect();
    //this.router.navigate(['/home']);
  }
  
  sendMail() {
    window.location.href = "mailto:support.mts@gu-group.ru?Subject=Help";
  }
  
  onKeyName(event: any) { // without type info
    
    this._name = event.data;
    console.log(this._name);
  }
  onKeyAge(event: any) { // without type info
    
    this._age = event.data;
    console.log(this._age);
  }
  
  
  // logout() {
    
  // }

}
