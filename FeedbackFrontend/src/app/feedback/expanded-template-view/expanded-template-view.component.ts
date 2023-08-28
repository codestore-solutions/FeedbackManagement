import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/services/feedback.service';
import { ActivatedRoute } from '@angular/router';
import { SingleFeedbackTemplateBody } from 'src/app/interfaces/feedback';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-expanded-template-view',
  templateUrl: './expanded-template-view.component.html',
  styleUrls: ['./expanded-template-view.component.scss']
})
export class ExpandedTemplateViewComponent implements OnInit {
  templateId!:string;
  categoryId!:string;
  template!:SingleFeedbackTemplateBody;
  templateName!:string;
  currentIdx:number = 0;

  constructor(
    private _feedbackService: FeedbackService,
    private _activatedRoute: ActivatedRoute,
    private _snackbar: MatSnackBar){}

  ngOnInit(): void {
    this.categoryId = this._activatedRoute.snapshot.paramMap.get("categoryId")!;
    this.templateId = this._activatedRoute.snapshot.paramMap.get("templateId")!;

    this._feedbackService.getTemplateById(this.templateId).subscribe((res)=>{
      this.template = res;
      this.templateName = this.template.response.templateName;
    })
  }

  handleCards(leftIdx:number):void{
    this.currentIdx = leftIdx;
  }

  setCurrentTemplateActive():void{
    this._feedbackService.setTemplateAsActive(this.categoryId, this.templateId).subscribe((res)=>{
      this._snackbar.open(`${this.templateName} has been set as active`, "OK", {duration:2500})
      window.location.reload();
    })
  }

  openGeneratedLinksDetailDialog():void{
    
  }

}