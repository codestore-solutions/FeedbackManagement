import { Component, Inject, OnInit } from '@angular/core';
import { CategoryBasedFeedbackTemplatesDetails } from 'src/app/interfaces/feedback';
import { FeedbackService } from 'src/app/services/feedback.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface CategoryID{
  categoryId:string;
}

@Component({
  selector: 'app-template-preference-popup',
  templateUrl: './template-preference-popup.component.html',
  styleUrls: ['./template-preference-popup.component.scss']
})
export class TemplatePreferencePopupComponent implements OnInit{
  categorySpecificTemplates!:CategoryBasedFeedbackTemplatesDetails;
  isFetched!:boolean;

  constructor(
    public dialogRef: MatDialogRef<TemplatePreferencePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryID,
    private _feedbackService: FeedbackService){}

  ngOnInit(): void {
    this._feedbackService.getCategoryBasedTemplateDetails(this.data.categoryId).subscribe((res)=>{
      this.categorySpecificTemplates = res;
      this.isFetched = true;
    }, (err)=>{
      this.isFetched = false;
    })
  }

  close(): void{
    this.dialogRef.close();
  }

}