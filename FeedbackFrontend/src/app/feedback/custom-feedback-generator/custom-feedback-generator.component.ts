import { Component, OnInit } from '@angular/core';
import { CustomFeedbackFormBodySchema } from 'src/app/interfaces/feedback';
import { FeedbackService } from 'src/app/services/feedback.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-feedback-generator',
  templateUrl: './custom-feedback-generator.component.html',
  styleUrls: ['./custom-feedback-generator.component.scss']
})
export class CustomFeedbackGeneratorComponent implements OnInit {
  options = [
    {
      type: "starrating",
      label: "Star Rating",
      value: "number",
      needsUpperBound: true
    },
    {
      type: "numberrating",
      label: "Number Rating",
      value: "number",
      needsUpperBound: true
    },
    {
      type: "emojirating",
      label: "Emoji Rating",
      value: "number",
      needsUpperBound: true
    },
    {
      type: "textarea",
      label: "Long Text",
      value: "textarea",
      isTextType: true
    },
    {
      type: "radio",
      label: "Radio",
      value: "radio",
      needsOptions: true,
      isTextType: false
    },
    {
      type: "file",
      label: "File",
      value: "file",
      needsOptions: false,
      isTextType: false
    },
    {
      type: "checkbox",
      label: "Check Box",
      value: "checkbox",
      needsOptions: true,
      isTextType: false
    }
  ];

  custom: CustomFeedbackFormBodySchema = {
    feedbackFormName: "",
    businessCategory: 0,
    feedbackType: "",
    sections: [
      {
        title: `New Section`,
        order: 1,
        questions: [
          {
            question: "",
            order: 1,
            answerFormat: {
              type: "",
              required: false
            }
          }
        ]
      }
    ]
  };

  importedTemplateId:string|null = "";

  constructor(
    private _feedbackService: FeedbackService,
    private _activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _router: Router
    ){}

  ngOnInit(): void {
    this.custom.businessCategory = parseInt(JSON.parse(localStorage.getItem('user')!).businessCategory);
    this.custom.feedbackType = this._activatedRoute.snapshot.paramMap.get("categoryId")!;
    this.importedTemplateId = this._activatedRoute.snapshot.paramMap.get("templateId");

    if(this.importedTemplateId){
      this._feedbackService.getTemplateById(this.importedTemplateId).subscribe((res)=>{
        this.custom.sections = res.response.sections;
      })
    }
  }

  trackByFn(index:number, item:any) {
    return index;  
  }

  addSection(): void {
    this.custom.sections.push({ title: "New Section", questions: [{ question: "", order: 1, answerFormat: { type: "", required: false } }] })
    for (let section of this.custom.sections) {
      section.order = (this.custom.sections.indexOf(section)) + 1;
      if(section.title.startsWith("New Section")){
        section.title = `New Section ${section.order}`
      }
    }
  }

  addQAToSection(outerIdx: number): void {
    this.custom.sections[outerIdx].questions.push({ question: "", answerFormat: { type: "", required: false } })
    for (let qa of this.custom.sections[outerIdx].questions) {
      qa.order = (this.custom.sections[outerIdx].questions.indexOf(qa)) + 1;
    }
  }

  removeQAFromSection(outerIdx: number, innerIdx: number): void {
    this.custom.sections[outerIdx].questions.splice(innerIdx, 1);
    for (let qa of this.custom.sections[outerIdx].questions) {
      qa.order = (this.custom.sections[outerIdx].questions.indexOf(qa)) + 1;
    }
  }

  deleteSection(outerIdx: number): void {
    this.custom.sections.splice(outerIdx, 1);
    for (let section of this.custom.sections) {
      section.order = (this.custom.sections.indexOf(section)) + 1;
      if(section.title.startsWith("New Section")){
        section.title = `New Section ${section.order}`;
      }
    }
  }

  handleAnswerType(e:string, outerIdx:number, innerIdx:number):void{
    if(e==="radio"){
      this.custom.sections[outerIdx].questions[innerIdx].answerFormat.options = [""];
    }
    if(e==="checkbox"){
      this.custom.sections[outerIdx].questions[innerIdx].answerFormat.options = [""];
    }
    if(e==="starrating" || e==="emojirating"){
      this.custom.sections[outerIdx].questions[innerIdx].answerFormat.upperBound = 5;
    }
    if(e==="numberrating"){
      this.custom.sections[outerIdx].questions[innerIdx].answerFormat.upperBound = 10;
    }
  }

  addOption(outerIdx:number, innerIdx:number):void{
    this.custom.sections[outerIdx].questions[innerIdx].answerFormat.options?.push("");
  }


  deleteOption(outerIdx:number, innerIdx:number,optionIdx:number){
    this.custom.sections[outerIdx].questions[innerIdx].answerFormat.options?.splice(optionIdx, 1);
  }

  saveCustomTemplate(): void {
    if(this.isGeneratedTemplateValid()){
      this._feedbackService.createCustomTemplate(this.custom).subscribe((res) => {
        this._snackBar.open("Template successfully created.", "OK", {duration: 2500});
        setTimeout(()=>{
          this._router.navigate(["admin/dashboard/feedback-templates"])
        }, 2500);
      }, (err)=>{
        this._snackBar.open("Failed to create the template.", "OK", {duration: 2500});
      })
    }
  }

  isGeneratedTemplateValid():boolean{
    if(this.custom.feedbackFormName.trim() === ""){
      alert(`Template Name is a mandatory field.`)
      return false
    }
    for(let section of this.custom.sections){
      if(section.title.trim()===""){
        alert(`Section Names are mandatory fields.`)
        return false
      }
      for(let qa of section.questions){
        if(qa.question.trim() === ""){
          alert(`Empty question fields are not allowed in section - ${section.title}`)
          return false
        }
        if(qa.answerFormat.type === ""){
          alert(`Empty answer fields are not allowed in section - ${section.title}`)
          return false
        }
        if(qa.answerFormat.type==="radio"){
          if(qa.answerFormat.options?.length===0){
            alert(`You must provide options for radio based answer types in section - ${section.title}`)
            return false
          }else{
            if(qa.answerFormat.options?.length!<2 && qa.answerFormat.options?.length!>10){
              alert(`Allowed number of options for a radio question type is between 2 and 10 in section - ${section.title}`)
              return false
            }
            for(let opt of qa.answerFormat.options!){
              if(opt === ""){
                alert(`You can't have an empty option for a radio answer type in section - ${section.title}`)
                return false
              }
              if(opt.length>30){
                alert(`Length of any particular option for radio answer type can't be more than 30 characters in section - ${section.title}`)
                return false
              }
            }
            let duplicates = qa.answerFormat.options?.filter((option:string, index:number)=>qa.answerFormat.options?.indexOf(option)!==index)
            if(duplicates?.length){
              alert(`You can't have duplicate options for a radio answer type in section - ${section.title}`)
              return false
            }
          }
        }
        if(qa.answerFormat.type==="checkbox"){
          if(qa.answerFormat.options?.length===0){
            alert(`You must provide options for checkbox based answer types in section - ${section.title}`)
            return false
          }else{
            if(qa.answerFormat.options?.length!<2 && qa.answerFormat.options?.length!>10){
              alert(`Allowed number of options for a checkbox question type is between 2 and 10 in section - ${section.title}`)
              return false
            }
            for(let opt of qa.answerFormat.options!){
              if(opt === ""){
                alert(`You can't have an empty option for a checkbox answer type in section - ${section.title}`)
                return false
              }
              if(opt.length>30){
                alert(`Length of any particular option for checkbox answer type can't be more than 30 characters in section - ${section.title}`)
                return false
              }
            }
            let duplicates = qa.answerFormat.options?.filter((option:string, index:number)=>qa.answerFormat.options?.indexOf(option)!==index)
            if(duplicates?.length){
              alert(`You can't have duplicate options for a checkbox answer type in section - ${section.title}`)
              return false
            }           
          }  
        }
      }
    }
    return true
  }
}
