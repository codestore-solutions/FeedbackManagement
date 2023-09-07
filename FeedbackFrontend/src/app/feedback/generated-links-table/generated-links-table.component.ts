import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GetAllLinks } from 'src/app/interfaces/feedback';
import { FeedbackService } from 'src/app/services/feedback.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';

export interface TemplateId{
  templateId: string;
}

@Component({
  selector: 'app-generated-links-table',
  templateUrl: './generated-links-table.component.html',
  styleUrls: ['./generated-links-table.component.scss']
})
export class GeneratedLinksTableComponent implements OnInit{
  businessAdminId!:number;
  generatedFeedbackLinks!:GetAllLinks;
  totalLinks!:number;
  dataSource!:MatTableDataSource<{
    _id:string;
    entityId:string;
    entityName:string;
    // templateId:string;
    feedbackUrl:string;
    isActive:boolean;
    createdBy:string;
    createdAt:string;
    updatedAt:string;
  }>;
  columnsToDisplay:string[] = ["serial", "entityId", "entityName", "feedbackUrl", "createdAt"];
  pageConfig:{pageNumber:number; pageSize:number;} = {
    pageNumber: 0,
    pageSize: 5
  }
  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    private _feedbackService: FeedbackService,
    private _dialogRef: DialogRef,
    private _snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: TemplateId,
  ){}

  ngOnInit(): void {
    this.businessAdminId = JSON.parse(localStorage.getItem('user')!).id;
    this.getGeneratedLinks();
  }

  getGeneratedLinks():void{
    this._feedbackService.getAllGeneratedLinks(this.businessAdminId, this.pageConfig.pageNumber+1, this.pageConfig.pageSize).subscribe((res)=>{
      this.generatedFeedbackLinks = res;
      this.dataSource = new MatTableDataSource(this.generatedFeedbackLinks.response.data);
      this.totalLinks = this.generatedFeedbackLinks.response.totalResponses;
    })
  }

  handlePageEvent(e:PageEvent):void{
    this.pageConfig.pageSize = e.pageSize;
    this.pageConfig.pageNumber = e.pageIndex;
    this.getGeneratedLinks();
  }

  copyLinkAlert(entityName:string):void{
    this._snackbar.open(`Link copied for ${entityName}`, "OK",{duration:2500})
  }

  closeDialog():void{
    this._dialogRef.close();
  }

}