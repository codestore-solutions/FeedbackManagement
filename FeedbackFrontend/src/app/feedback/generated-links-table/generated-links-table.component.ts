import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GetAllLinks } from 'src/app/interfaces/feedback';
import { FeedbackService } from 'src/app/services/feedback.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-generated-links-table',
  templateUrl: './generated-links-table.component.html',
  styleUrls: ['./generated-links-table.component.scss']
})
export class GeneratedLinksTableComponent implements OnInit{
  data:any;

  businessAdminId!:number;
  generatedFeedbackLinks!:GetAllLinks;
  totalLinks!:number;
  dataSource!:MatTableDataSource<{
    _id:string;
    entityId:string;
    entityName:string;
    feedbackUrl:string;
    isActive:boolean;
    createdBy:string;
    createdAt:string;
    updatedAt:string;
  }>;
  columnsToDisplay:string[] = ["serial", "entityId", "entityName", "feedbackUrl", "createdAt"];
  pageConfig:{pageNumber:number; pageSize:number;} = {
    pageNumber: 0,
    pageSize: 10
  }
  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    private _feedbackService: FeedbackService,
    private _snackbar: MatSnackBar
  ){}

  ngOnInit(): void {
    this.businessAdminId = JSON.parse(localStorage.getItem('user')!).id;
    this.getGeneratedLinks();
    this.dataSource = new MatTableDataSource(this.data);
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

}