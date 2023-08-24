import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FeedbackService } from 'src/app/services/feedback.service';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import { LinkGenerationPayload } from 'src/app/interfaces/feedback';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface CategoryID{
  categoryId:string;
  categoryName:string;
}

@Component({
  selector: 'app-template-link-generator',
  templateUrl: './template-link-generator.component.html',
  styleUrls: ['./template-link-generator.component.scss']
})
export class TemplateLinkGeneratorComponent implements OnInit{
  businessAdminId!:string;
  categoryId!:string;
  categoryName!:string;
  generatedLink!:string;

  templateLinkGeneratorForm = new FormGroup({
    // authorId: new FormControl("", [Validators.required]),
    // authorName: new FormControl("", [Validators.required]),
    entityId: new FormControl("", [Validators.required]),
    entityName: new FormControl("", [Validators.required])
  })

  constructor(
    public dialogRef: MatDialogRef<TemplateLinkGeneratorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryID,
    private _feedbackService: FeedbackService,
    private _snackbar: MatSnackBar
  ){}

  ngOnInit(): void {
    this.businessAdminId = JSON.parse(localStorage.getItem("user")!).id;
    this.categoryId = this.data.categoryId;
    this.categoryName = this.data.categoryName;
  }

  linkCopiedAlert():void{
    this._snackbar.open("Link Copied!", "OK", {duration: 1500})
  }

  generateLink():void{
    let payload:LinkGenerationPayload = {
      entityId: this.templateLinkGeneratorForm.value.entityId!,
      entityName: this.templateLinkGeneratorForm.value.entityName!
    }
    if(
      this.templateLinkGeneratorForm.value.entityId?.trim()=="" ||
      this.templateLinkGeneratorForm.value.entityName?.trim()==""
      ){
        this._snackbar.open("Empty fields are not allowed to generate link.", "OK", {duration: 3000})
        return
      }

    this._feedbackService.getGeneratedTemplateLink(this.categoryId, this.businessAdminId, payload)
    .subscribe((res)=>{
      this.generatedLink = res.response;
    })
  }
}