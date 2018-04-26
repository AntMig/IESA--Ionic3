import { Component, keyframes } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DICTIONARY } from '../../providers/globals';
import { AlertProvider } from '../../providers/alert.provider'
import { User } from '../../providers/user'
import * as $ from "jquery";

@IonicPage()
@Component({
  selector: 'page-hangman',
  templateUrl: 'hangman.html',
})
export class HangmanPage {
  alertCtrl: any;
  alertProvider: any;
  mot = ""
  lettres = []
  lettreEntree = ""
  lettreTrouve = []
  tentative = 11
  pendu = ""
  useLetter = []
  ratio?:string = this.ratioCalcul()

  constructor(public navCtrl: NavController, public navParams: NavParams, private alert: AlertProvider, private user: User) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HangmanPage');
    this.newGame()
  }

  ratioCalcul(){
    if(this.user.victoires + this.user.defaites > 0){
    return (this.user.victoires / (this.user.victoires +  this.user.defaites) * 100) + '%'
    }else{
      return('pas de valeurs pour le moment')
    }
  }

  newGame(){
    this.ratio = this.ratioCalcul()
    this.lettres = []
    this.useLetter = []
    this.tentative = 11
    let motATrouver = Math.round(Math.random() * DICTIONARY.length)
    this.mot = DICTIONARY[motATrouver].key
    console.log(this.mot)
    let motDecoupe = this.mot.split("")
    
    for(let lettre of motDecoupe){
      this.lettres.push(
        {valeur:lettre, trouve:false}
      )
    }
    
    console.log(motDecoupe)
  }

  testLetter(){
    let difLetter = true;
    this.useLetter.map(letter => {
      if(letter.letter === this.lettreEntree){
        difLetter = false;
      }
    })
    return difLetter
  }

  /*animPendu(){

    document.getElementById("pendus").animate():
    [
      // keyframes
      { transform: 'rotate(-30deg)' }, 
      { transform: 'rotate(30deg)' }
    ], { 
      // timing options
      duration: 2000,
      iterations: Infinity
    });

  }*/

  resultat(){
    console.log(this.lettreTrouve.length,this.lettres.length)

    if(this.lettreEntree.match(/[a-zA-Z-]/) && this.testLetter()){
     
      let trouve = false
      this.useLetter.push({letter:this.lettreEntree, value: 0})

      this.lettres.map(lettre => {
        if(lettre.valeur === this.lettreEntree.toLowerCase()){
          lettre.trouve = true
          trouve = true
          this.useLetter[this.useLetter.length - 1].value = 1;
          this.lettreTrouve.push(lettre)
        }
      })
      if(this.lettreTrouve.length === this.lettres.length){
        this.alert.presentAlert("Victoire ;(", "Vous avez gagné..", "Ok")
        this.user.victoires ++
      }
      if(trouve === false){
        this.tentative --
        this.pendu = "../../../assets/imgs/hangman/hung"+ (11 - this.tentative) +".png"
        console.log(this.tentative)

        if(this.tentative === 0){
          this.user.defaites ++
          console.log("perdu")
              this.alert.presentAlert("Défaite ;(", "Vous avez perdu...", "Ok")
              /*this.animPendu()*/
        }

      }
    }else{
      console.log("pas OK")
      if(!this.lettreEntree.match(/[a-zA-Z-]/)){
        this.alert.presentAlert("Erreur ;(", "Vous avez rentré un craractère incorrect", "Ok")
      }else{
        this.alert.presentAlert("Erreur ;(", "Vous avez rentré un craractère déja utilisé", "Ok")
      }
    }
    this.lettreEntree = ""
  }
 

}

